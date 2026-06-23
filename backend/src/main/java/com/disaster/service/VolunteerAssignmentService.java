package com.disaster.service;

import com.disaster.dto.VolunteerAssignmentRequest;
import com.disaster.dto.VolunteerAssignmentResponse;
import com.disaster.entity.AvailabilityStatus;
import com.disaster.entity.ReliefCamp;
import com.disaster.entity.Volunteer;
import com.disaster.entity.VolunteerAssignment;
import com.disaster.exception.BusinessRuleException;
import com.disaster.exception.ResourceNotFoundException;
import com.disaster.repository.ReliefCampRepository;
import com.disaster.repository.VolunteerAssignmentRepository;
import com.disaster.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Manages the M:N relationship between Volunteer and ReliefCamp.
 *
 * UNIQUE(volunteer_id, camp_id) prevents the same volunteer from being
 * assigned twice to the same camp. The check is done in the service
 * first so the API returns a clean 409 with a meaningful message;
 * the DB constraint is the backstop.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class VolunteerAssignmentService {

    private final VolunteerAssignmentRepository assignmentRepository;
    private final VolunteerRepository volunteerRepository;
    private final ReliefCampRepository campRepository;
    private final VolunteerService volunteerService;

    public List<VolunteerAssignmentResponse> findAll() {
        return assignmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<VolunteerAssignmentResponse> findByVolunteer(Long volunteerId) {
        return assignmentRepository.findByVolunteerVolunteerId(volunteerId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<VolunteerAssignmentResponse> findByCamp(Long campId) {
        return assignmentRepository.findByCampCampId(campId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * POST /api/volunteers/{volunteerId}/assignments
     * Spec endpoint — keeps the URL shape stable even though the
     * volunteerId appears in the path.
     */
    public VolunteerAssignmentResponse assign(Long volunteerId, VolunteerAssignmentRequest req) {
        Volunteer v = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Volunteer not found: " + volunteerId));
        ReliefCamp camp = campRepository.findById(req.getCampId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ReliefCamp not found: " + req.getCampId()));

        if (assignmentRepository
                .findByVolunteerVolunteerIdAndCampCampId(volunteerId, req.getCampId())
                .isPresent()) {
            throw new BusinessRuleException(
                    "Volunteer " + v.getName() + " is already assigned to camp "
                            + camp.getCampName());
        }

        VolunteerAssignment a = VolunteerAssignment.builder()
                .volunteer(v)
                .camp(camp)
                .dutyHours(req.getDutyHours())
                .assignedDate(req.getAssignedDate())
                .build();
        VolunteerAssignment saved = assignmentRepository.save(a);

        // Mark the volunteer as busy if they have any active assignments.
        // (Simple rule for v1: assigning always marks them BUSY.)
        volunteerService.setAvailability(volunteerId, AvailabilityStatus.BUSY);

        return toResponse(saved);
    }

    /**
     * Removing an assignment flips the volunteer back to AVAILABLE only
     * if they have no other active assignments.
     */
    public void unassign(Long assignmentId) {
        VolunteerAssignment a = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "VolunteerAssignment not found: " + assignmentId));
        Long volunteerId = a.getVolunteer().getVolunteerId();
        assignmentRepository.delete(a);

        List<VolunteerAssignment> remaining =
                assignmentRepository.findByVolunteerVolunteerId(volunteerId);
        if (remaining.isEmpty()) {
            volunteerService.setAvailability(volunteerId, AvailabilityStatus.AVAILABLE);
        }
    }

    private VolunteerAssignmentResponse toResponse(VolunteerAssignment a) {
        return VolunteerAssignmentResponse.builder()
                .assignmentId(a.getAssignmentId())
                .volunteerId(a.getVolunteer().getVolunteerId())
                .volunteerName(a.getVolunteer().getName())
                .campId(a.getCamp().getCampId())
                .campName(a.getCamp().getCampName())
                .dutyHours(a.getDutyHours())
                .assignedDate(a.getAssignedDate())
                .build();
    }
}
