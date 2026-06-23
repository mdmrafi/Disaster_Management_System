package com.disaster.service;

import com.disaster.dto.DisasterRequest;
import com.disaster.dto.DisasterResponse;
import com.disaster.entity.Disaster;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.DisasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD for Disaster. Relatively thin: validation is mostly
 * Bean-Validation on the request DTO. startDate is required;
 * endDate is optional (open-ended disasters are allowed).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DisasterService {

    private final DisasterRepository disasterRepository;

    public List<DisasterResponse> findAll() {
        return disasterRepository.findAll().stream()
                .map(DisasterService::toResponse)
                .toList();
    }

    public DisasterResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public DisasterResponse create(DisasterRequest req) {
        if (req.getEndDate() != null && req.getEndDate().isBefore(req.getStartDate())) {
            throw new IllegalArgumentException("endDate must be on or after startDate");
        }
        Disaster d = Disaster.builder()
                .disasterName(req.getDisasterName())
                .disasterType(req.getDisasterType())
                .severityLevel(req.getSeverityLevel())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .description(req.getDescription())
                .build();
        return toResponse(disasterRepository.save(d));
    }

    public DisasterResponse update(Long id, DisasterRequest req) {
        Disaster d = getOrThrow(id);
        if (req.getEndDate() != null && req.getEndDate().isBefore(req.getStartDate())) {
            throw new IllegalArgumentException("endDate must be on or after startDate");
        }
        d.setDisasterName(req.getDisasterName());
        d.setDisasterType(req.getDisasterType());
        d.setSeverityLevel(req.getSeverityLevel());
        d.setStartDate(req.getStartDate());
        d.setEndDate(req.getEndDate());
        d.setDescription(req.getDescription());
        return toResponse(d);
    }

    public void delete(Long id) {
        if (!disasterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Disaster not found: " + id);
        }
        // FKs use ON DELETE RESTRICT, so the DB will reject if any
        // affected_area row references this disaster. The resulting
        // DataIntegrityViolationException is mapped to 409 by the
        // global handler.
        disasterRepository.deleteById(id);
    }

    private Disaster getOrThrow(Long id) {
        return disasterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disaster not found: " + id));
    }

    static DisasterResponse toResponse(Disaster d) {
        return DisasterResponse.builder()
                .disasterId(d.getDisasterId())
                .disasterName(d.getDisasterName())
                .disasterType(d.getDisasterType())
                .severityLevel(d.getSeverityLevel())
                .startDate(d.getStartDate())
                .endDate(d.getEndDate())
                .description(d.getDescription())
                .build();
    }
}
