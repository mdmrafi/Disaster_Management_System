package com.disaster.controller;

import com.disaster.dto.VolunteerRequest;
import com.disaster.dto.VolunteerResponse;
import com.disaster.service.VolunteerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/volunteers — CRUD for volunteers. */
@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping
    public List<VolunteerResponse> list() {
        return volunteerService.findAll();
    }

    @GetMapping("/{id}")
    public VolunteerResponse get(@PathVariable Long id) {
        return volunteerService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VolunteerResponse create(@Valid @RequestBody VolunteerRequest req) {
        return volunteerService.create(req);
    }

    @PutMapping("/{id}")
    public VolunteerResponse update(@PathVariable Long id,
                                    @Valid @RequestBody VolunteerRequest req) {
        return volunteerService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        volunteerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
