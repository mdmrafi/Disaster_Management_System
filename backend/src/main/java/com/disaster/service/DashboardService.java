package com.disaster.service;

import com.disaster.dto.DashboardSummary;
import com.disaster.dto.ShortageReport;
import com.disaster.repository.DisasterRepository;
import com.disaster.repository.ReliefCampRepository;
import com.disaster.repository.VictimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Builds the dashboard summary the frontend shows on the home page.
 * Just composes counts from the repos plus the urgent shortage list.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final DisasterRepository disasterRepository;
    private final ReliefCampRepository campRepository;
    private final VictimRepository victimRepository;
    private final ShortageService shortageService;

    public DashboardSummary getSummary() {
        List<ShortageReport> urgent = shortageService.findUrgentShortages();
        return DashboardSummary.builder()
                .totalDisasters(disasterRepository.count())
                .activeCamps(campRepository.count())
                .totalVictims(victimRepository.count())
                .urgentShortageCount(urgent.size())
                .urgentCamps(urgent)
                .build();
    }
}
