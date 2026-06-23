package com.disaster.service;

import com.disaster.dto.ShortageReport;
import com.disaster.entity.PriorityLevel;
import com.disaster.entity.ReliefCamp;
import com.disaster.entity.ResourceCategory;
import com.disaster.repository.ReliefCampRepository;
import com.disaster.repository.ResourceAllocationRepository;
import com.disaster.repository.VictimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Shortage detection engine.
 *
 * A camp is "in shortage" when ANY of the following conditions holds:
 *   C1 — food shortage: sumAllocated(FOOD) / occupancy < FOOD_SHORTAGE_THRESHOLD_PER_OCCUPANT
 *   C2 — medical shortage: medicalCases > 0 AND sumAllocated(MEDICAL) == 0
 *   C3 — essential-threshold shortage: any category with
 *        sumAllocated(category) < ESSENTIAL_RESOURCE_MIN_THRESHOLD
 *
 * "urgent" is true when:
 *   - 2+ conditions hold, OR
 *   - any HIGH-priority victim exists AND at least 1 condition holds.
 *
 * The thresholds are centralizable here so they're easy to tune. They
 * are intentionally public static so the controller/docs can reference
 * the same constants if needed.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShortageService {

    /** Per-occupant food-stock minimum. 2 means we want at least 2 food
     *  units allocated per registered victim before we consider the
     *  camp food-secure. */
    public static final double FOOD_SHORTAGE_THRESHOLD_PER_OCCUPANT = 2.0;

    /** Absolute minimum stock per category. If a camp has fewer than
     *  this many units of any category, the camp is flagged. */
    public static final int ESSENTIAL_RESOURCE_MIN_THRESHOLD = 10;

    private final ReliefCampRepository campRepository;
    private final VictimRepository victimRepository;
    private final ResourceAllocationRepository allocationRepository;

    public List<ShortageReport> computeReports() {
        List<ReliefCamp> camps = campRepository.findAll();
        List<ShortageReport> reports = new ArrayList<>();
        for (ReliefCamp camp : camps) {
            ShortageReport r = evaluateCamp(camp);
            if (!r.getTriggeredConditions().isEmpty()) {
                reports.add(r);
            }
        }
        return reports;
    }

    public List<ShortageReport> findUrgentShortages() {
        return computeReports().stream()
                .filter(ShortageReport::isUrgent)
                .toList();
    }

    private ShortageReport evaluateCamp(ReliefCamp camp) {
        long highPriority = victimRepository
                .findByCampCampIdAndPriorityLevel(camp.getCampId(), PriorityLevel.HIGH)
                .size();
        long medical = victimRepository.countMedicalCasesInCamp(camp.getCampId());

        Map<ResourceCategory, Long> allocatedByCategory = Map.of(
                ResourceCategory.FOOD,      allocationRepository
                        .sumAllocatedQuantityByCampAndCategory(camp.getCampId(), ResourceCategory.FOOD),
                ResourceCategory.MEDICAL,   allocationRepository
                        .sumAllocatedQuantityByCampAndCategory(camp.getCampId(), ResourceCategory.MEDICAL),
                ResourceCategory.SHELTER,   allocationRepository
                        .sumAllocatedQuantityByCampAndCategory(camp.getCampId(), ResourceCategory.SHELTER),
                ResourceCategory.CLOTHING,  allocationRepository
                        .sumAllocatedQuantityByCampAndCategory(camp.getCampId(), ResourceCategory.CLOTHING)
        );

        List<String> conditions = new ArrayList<>();
        int occupancy = Math.max(1, camp.getCurrentOccupancy()); // avoid divide-by-zero

        // C1 — food shortage
        double foodPerOccupant = (double) allocatedByCategory.get(ResourceCategory.FOOD) / occupancy;
        if (foodPerOccupant < FOOD_SHORTAGE_THRESHOLD_PER_OCCUPANT) {
            conditions.add("Food shortage: " +
                    allocatedByCategory.get(ResourceCategory.FOOD) + " food units for " +
                    camp.getCurrentOccupancy() + " victims ("
                    + String.format("%.2f", foodPerOccupant) + "/occupant, threshold "
                    + FOOD_SHORTAGE_THRESHOLD_PER_OCCUPANT + ")");
        }

        // C2 — medical shortage
        if (medical > 0 && allocatedByCategory.get(ResourceCategory.MEDICAL) == 0) {
            conditions.add("Medical shortage: " + medical
                    + " medical cases with 0 medical units allocated");
        }

        // C3 — essential-threshold shortage across all categories
        for (Map.Entry<ResourceCategory, Long> e : allocatedByCategory.entrySet()) {
            if (e.getValue() < ESSENTIAL_RESOURCE_MIN_THRESHOLD) {
                conditions.add("Low " + e.getKey() + " stock: " + e.getValue()
                        + " units (threshold " + ESSENTIAL_RESOURCE_MIN_THRESHOLD + ")");
            }
        }

        boolean urgent = (conditions.size() >= 2)
                || (highPriority > 0 && conditions.size() >= 1);

        String reason = conditions.isEmpty()
                ? "No shortage"
                : (urgent ? "URGENT — " : "")
                    + String.join("; ", conditions);

        return ShortageReport.builder()
                .campId(camp.getCampId())
                .campName(camp.getCampName())
                .areaName(camp.getArea().getAreaName())
                .disasterName(camp.getArea().getDisaster().getDisasterName())
                .currentOccupancy(camp.getCurrentOccupancy())
                .highPriorityVictims(highPriority)
                .medicalCases(medical)
                .triggeredConditions(conditions)
                .urgent(urgent)
                .reason(reason)
                .build();
    }
}
