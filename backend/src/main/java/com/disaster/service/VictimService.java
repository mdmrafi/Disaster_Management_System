package com.disaster.service;

import com.disaster.dto.VictimRequest;
import com.disaster.dto.VictimResponse;
import com.disaster.entity.ReliefCamp;
import com.disaster.entity.Victim;
import com.disaster.exception.BusinessRuleException;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.ReliefCampRepository;
import com.disaster.repository.VictimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Victim registration is the one place where the application's
 * "derived column" rule (current_occupancy) is maintained. The DB
 * CHECK constraint is a backstop; the service does the friendly check
 * first so the error message is clear.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class VictimService {

    private final VictimRepository victimRepository;
    private final ReliefCampRepository campRepository;

    public List<VictimResponse> findAll() {
        return victimRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<VictimResponse> findByCamp(Long campId) {
        return victimRepository.findByCampCampId(campId).stream()
                .map(this::toResponse)
                .toList();
    }

    public VictimResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    /**
     * Register a victim in a camp. Throws BusinessRuleException("Camp is full")
     * if the camp is at capacity. The DB CHECK will also reject the insert
     * with a 45000 signal, but doing it in the service gives a friendlier
     * 409 with a clear message.
     */
    public VictimResponse register(VictimRequest req) {
        ReliefCamp camp = campRepository.findById(req.getCampId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ReliefCamp not found: " + req.getCampId()));
        if (camp.getCurrentOccupancy() >= camp.getCapacity()) {
            throw new BusinessRuleException("Camp is full: " + camp.getCampName()
                    + " (" + camp.getCurrentOccupancy() + "/" + camp.getCapacity() + ")");
        }
        Victim v = Victim.builder()
                .name(req.getName())
                .age(req.getAge())
                .gender(req.getGender())
                .familyMembers(req.getFamilyMembers() == null ? 0 : req.getFamilyMembers())
                .priorityLevel(req.getPriorityLevel())
                .medicalCondition(req.getMedicalCondition())
                .camp(camp)
                .build();
        Victim saved = victimRepository.save(v);
        // Maintain derived occupancy counter atomically within this transaction.
        camp.setCurrentOccupancy(camp.getCurrentOccupancy() + 1);
        campRepository.save(camp);
        return toResponse(saved);
    }

    public VictimResponse update(Long id, VictimRequest req) {
        Victim v = getOrThrow(id);
        // If camp changes, we must re-balance both camps' occupancy counters.
        if (!v.getCamp().getCampId().equals(req.getCampId())) {
            ReliefCamp oldCamp = v.getCamp();
            ReliefCamp newCamp = campRepository.findById(req.getCampId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "ReliefCamp not found: " + req.getCampId()));
            if (newCamp.getCurrentOccupancy() >= newCamp.getCapacity()) {
                throw new BusinessRuleException("Destination camp is full: "
                        + newCamp.getCampName());
            }
            oldCamp.setCurrentOccupancy(Math.max(0, oldCamp.getCurrentOccupancy() - 1));
            newCamp.setCurrentOccupancy(newCamp.getCurrentOccupancy() + 1);
            campRepository.save(oldCamp);
            campRepository.save(newCamp);
            v.setCamp(newCamp);
        }
        v.setName(req.getName());
        v.setAge(req.getAge());
        v.setGender(req.getGender());
        v.setFamilyMembers(req.getFamilyMembers() == null ? 0 : req.getFamilyMembers());
        v.setPriorityLevel(req.getPriorityLevel());
        v.setMedicalCondition(req.getMedicalCondition());
        return toResponse(v);
    }

    public void delete(Long id) {
        Victim v = getOrThrow(id);
        ReliefCamp camp = v.getCamp();
        victimRepository.delete(v);
        // Decrement the counter for the camp we just freed a bed in.
        camp.setCurrentOccupancy(Math.max(0, camp.getCurrentOccupancy() - 1));
        campRepository.save(camp);
    }

    private Victim getOrThrow(Long id) {
        return victimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Victim not found: " + id));
    }

    private VictimResponse toResponse(Victim v) {
        return VictimResponse.builder()
                .victimId(v.getVictimId())
                .name(v.getName())
                .age(v.getAge())
                .gender(v.getGender())
                .familyMembers(v.getFamilyMembers())
                .priorityLevel(v.getPriorityLevel())
                .medicalCondition(v.getMedicalCondition())
                .campId(v.getCamp().getCampId())
                .campName(v.getCamp().getCampName())
                .build();
    }
}
