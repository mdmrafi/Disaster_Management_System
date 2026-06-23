package com.disaster.controller;

import com.disaster.dto.VolunteerAssignmentRequest;
import com.disaster.dto.VolunteerAssignmentResponse;
import com.disaster.service.VolunteerAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Volunteer ↔ Camp assignment endpoints.
 *
 * Two URL patterns are supported for backward-compat with both
 * "assignments-as-first-class-resources" and the spec's preferred
 * "actions on a volunteer" style:
 *   - POST   /api/assignments                    — body: {volunteerId, campId}
 *   - POST   /api/volunteers/{volunteerId}/assignments — body: {campId}
 *   - GET    /api/assignments
 *   - GET    /api/assignments?volunteerId=...
 *   - GET    /api/assignments?campId=...
 *   - GET    /api/volunteers/{volunteerId}/assignments
 *   - GET    /api/camps/{campId}/assignments
 *   - DELETE /api/assignments/{id}
 */
@RestController
@RequiredArgsConstructor
public class VolunteerAssignmentController {

    private final VolunteerAssignmentService assignmentService;

    /* -------- Flat /api/assignments routes -------- */

    @GetMapping("/api/assignments")
    public List<VolunteerAssignmentResponse> list(
            @RequestParam(value = "volunteerId", required = false) Long volunteerId,
            @RequestParam(value = "campId", required = false) Long campId) {
        if (volunteerId != null) {
            return assignmentService.findByVolunteer(volunteerId);
        }
        if (campId != null) {
            return assignmentService.findByCamp(campId);
        }
        return assignmentService.findAll();
    }

    @PostMapping("/api/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public VolunteerAssignmentResponse create(@Valid @RequestBody VolunteerAssignmentRequest req) {
        // body must include volunteerId + campId
        return assignmentService.assign(req.getVolunteerId(), req);
    }

    @DeleteMapping("/api/assignments/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.unassign(id);
        return ResponseEntity.noContent().build();
    }

    /* -------- Nested /api/volunteers/{id}/assignments routes -------- */

    @GetMapping("/api/volunteers/{volunteerId}/assignments")
    public List<VolunteerAssignmentResponse> listForVolunteer(@PathVariable Long volunteerId) {
        return assignmentService.findByVolunteer(volunteerId);
    }

    @PostMapping("/api/volunteers/{volunteerId}/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public VolunteerAssignmentResponse assignToVolunteer(
            @PathVariable Long volunteerId,
            @Valid @RequestBody VolunteerAssignmentRequest req) {
        return assignmentService.assign(volunteerId, req);
    }

    /* -------- Nested /api/camps/{id}/assignments routes -------- */

    @GetMapping("/api/camps/{campId}/assignments")
    public List<VolunteerAssignmentResponse> listForCamp(@PathVariable Long campId) {
        return assignmentService.findByCamp(campId);
    }
}
