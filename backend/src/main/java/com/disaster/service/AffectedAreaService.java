package com.disaster.service;

import com.disaster.dto.AffectedAreaRequest;
import com.disaster.dto.AffectedAreaResponse;
import com.disaster.entity.AffectedArea;
import com.disaster.entity.Disaster;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.AffectedAreaRepository;
import com.disaster.repository.DisasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** CRUD for AffectedArea. Always requires a valid parent disasterId. */
@Service
@RequiredArgsConstructor
@Transactional
public class AffectedAreaService {

    private final AffectedAreaRepository areaRepository;
    private final DisasterRepository disasterRepository;

    public List<AffectedAreaResponse> findAll() {
        return areaRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<AffectedAreaResponse> findByDisaster(Long disasterId) {
        return areaRepository.findByDisasterDisasterId(disasterId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AffectedAreaResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public AffectedAreaResponse create(AffectedAreaRequest req) {
        Disaster d = disasterRepository.findById(req.getDisasterId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Disaster not found: " + req.getDisasterId()));
        AffectedArea a = AffectedArea.builder()
                .areaName(req.getAreaName())
                .district(req.getDistrict())
                .population(req.getPopulation())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .severity(req.getSeverity())
                .disaster(d)
                .build();
        return toResponse(areaRepository.save(a));
    }

    public AffectedAreaResponse update(Long id, AffectedAreaRequest req) {
        AffectedArea a = getOrThrow(id);
        Disaster d = disasterRepository.findById(req.getDisasterId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Disaster not found: " + req.getDisasterId()));
        a.setAreaName(req.getAreaName());
        a.setDistrict(req.getDistrict());
        a.setPopulation(req.getPopulation());
        a.setLatitude(req.getLatitude());
        a.setLongitude(req.getLongitude());
        a.setSeverity(req.getSeverity());
        a.setDisaster(d);
        return toResponse(a);
    }

    public void delete(Long id) {
        if (!areaRepository.existsById(id)) {
            throw new ResourceNotFoundException("AffectedArea not found: " + id);
        }
        areaRepository.deleteById(id);
    }

    private AffectedArea getOrThrow(Long id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AffectedArea not found: " + id));
    }

    private AffectedAreaResponse toResponse(AffectedArea a) {
        return AffectedAreaResponse.builder()
                .areaId(a.getAreaId())
                .areaName(a.getAreaName())
                .district(a.getDistrict())
                .population(a.getPopulation())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .severity(a.getSeverity())
                .disasterId(a.getDisaster().getDisasterId())
                .disasterName(a.getDisaster().getDisasterName())
                .build();
    }
}
