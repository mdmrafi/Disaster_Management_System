package com.disaster.service;

import com.disaster.dto.VolunteerRequest;
import com.disaster.dto.VolunteerResponse;
import com.disaster.entity.AvailabilityStatus;
import com.disaster.entity.Volunteer;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** CRUD for Volunteer. availabilityStatus defaults to AVAILABLE. */
@Service
@RequiredArgsConstructor
@Transactional
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    public List<VolunteerResponse> findAll() {
        return volunteerRepository.findAll().stream()
                .map(VolunteerService::toResponse)
                .toList();
    }

    public VolunteerResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public VolunteerResponse create(VolunteerRequest req) {
        Volunteer v = Volunteer.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .specialization(req.getSpecialization())
                .availabilityStatus(AvailabilityStatus.AVAILABLE)
                .build();
        return toResponse(volunteerRepository.save(v));
    }

    public VolunteerResponse update(Long id, VolunteerRequest req) {
        Volunteer v = getOrThrow(id);
        v.setName(req.getName());
        v.setPhone(req.getPhone());
        v.setSpecialization(req.getSpecialization());
        return toResponse(v);
    }

    /**
     * Mark a volunteer as BUSY when they get assigned, and AVAILABLE
     * again when their last assignment is removed. Triggered from
     * VolunteerAssignmentService; exposed here so the logic lives in
     * one place.
     */
    public void setAvailability(Long volunteerId, AvailabilityStatus status) {
        Volunteer v = getOrThrow(volunteerId);
        v.setAvailabilityStatus(status);
    }

    public void delete(Long id) {
        if (!volunteerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Volunteer not found: " + id);
        }
        volunteerRepository.deleteById(id);
    }

    private Volunteer getOrThrow(Long id) {
        return volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found: " + id));
    }

    static VolunteerResponse toResponse(Volunteer v) {
        return VolunteerResponse.builder()
                .volunteerId(v.getVolunteerId())
                .name(v.getName())
                .phone(v.getPhone())
                .specialization(v.getSpecialization())
                .availabilityStatus(v.getAvailabilityStatus())
                .build();
    }
}
