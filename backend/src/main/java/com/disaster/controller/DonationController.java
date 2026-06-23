package com.disaster.controller;

import com.disaster.dto.DonationRequest;
import com.disaster.dto.DonationResponse;
import com.disaster.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/donations — CRUD for donations. */
@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @GetMapping
    public List<DonationResponse> list() {
        return donationService.findAll();
    }

    @GetMapping("/{id}")
    public DonationResponse get(@PathVariable Long id) {
        return donationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DonationResponse create(@Valid @RequestBody DonationRequest req) {
        return donationService.create(req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        donationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
