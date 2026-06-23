package com.disaster.service;

import com.disaster.dto.ReliefCampRequest;
import com.disaster.dto.ReliefCampResponse;
import com.disaster.entity.AffectedArea;
import com.disaster.entity.ReliefCamp;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.AffectedAreaRepository;
import com.disaster.repository.ReliefCampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD for ReliefCamp. Note: currentOccupancy is NOT modified by this
 * service — it is incremented by VictimService when a victim is
 * registered, and decremented when a victim leaves (not implemented in v1).
 * On create we always start at 0.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ReliefCampService {

    private final ReliefCampRepository campRepository;
    private final AffectedAreaRepository areaRepository;

    public List<ReliefCampResponse> findAll() {
        return campRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<ReliefCampResponse> findByArea(Long areaId) {
        return campRepository.findByAreaAreaId(areaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ReliefCampResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public ReliefCampResponse create(ReliefCampRequest req) {
        AffectedArea area = areaRepository.findById(req.getAreaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "AffectedArea not found: " + req.getAreaId()));
        ReliefCamp c = ReliefCamp.builder()
                .campName(req.getCampName())
                .location(req.getLocation())
                .capacity(req.getCapacity())
                .currentOccupancy(0)
                .area(area)
                .build();
        return toResponse(campRepository.save(c));
    }

    public ReliefCampResponse update(Long id, ReliefCampRequest req) {
        ReliefCamp c = getOrThrow(id);
        if (req.getCapacity() < c.getCurrentOccupancy()) {
            throw new IllegalArgumentException(
                    "New capacity (" + req.getCapacity() +
                            ") is below current occupancy (" + c.getCurrentOccupancy() + ")");
        }
        AffectedArea area = areaRepository.findById(req.getAreaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "AffectedArea not found: " + req.getAreaId()));
        c.setCampName(req.getCampName());
        c.setLocation(req.getLocation());
        c.setCapacity(req.getCapacity());
        c.setArea(area);
        return toResponse(c);
    }

    public void delete(Long id) {
        if (!campRepository.existsById(id)) {
            throw new ResourceNotFoundException("ReliefCamp not found: " + id);
        }
        campRepository.deleteById(id);
    }

    private ReliefCamp getOrThrow(Long id) {
        return campRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReliefCamp not found: " + id));
    }

    private ReliefCampResponse toResponse(ReliefCamp c) {
        return ReliefCampResponse.builder()
                .campId(c.getCampId())
                .campName(c.getCampName())
                .location(c.getLocation())
                .capacity(c.getCapacity())
                .currentOccupancy(c.getCurrentOccupancy())
                .areaId(c.getArea().getAreaId())
                .areaName(c.getArea().getAreaName())
                .disasterId(c.getArea().getDisaster().getDisasterId())
                .disasterName(c.getArea().getDisaster().getDisasterName())
                .build();
    }
}
