package com.disaster.controller;

import com.disaster.dto.ResourceAllocationRequest;
import com.disaster.dto.ResourceAllocationResponse;
import com.disaster.service.ResourceAllocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * /api/allocations — CRUD for resource allocations to camps.
 *
 * NOTE: When stock is insufficient, the service throws
 * {@link com.disaster.exception.InsufficientResourceException} with a
 * message of the form
 *   "Insufficient stock for resource 'NAME' — requested N, available M"
 * which {@link com.disaster.exception.GlobalExceptionHandler} surfaces
 * verbatim as a 409 with a JSON envelope. The frontend Allocations page
 * displays that message in the toast / inline error.
 */
@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
public class ResourceAllocationController {

    private final ResourceAllocationService allocationService;

    @GetMapping
    public List<ResourceAllocationResponse> list(
            @RequestParam(value = "campId", required = false) Long campId) {
        if (campId != null) {
            return allocationService.findByCamp(campId);
        }
        return allocationService.findAll();
    }

    @GetMapping("/{id}")
    public ResourceAllocationResponse get(@PathVariable Long id) {
        return allocationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceAllocationResponse create(@Valid @RequestBody ResourceAllocationRequest req) {
        return allocationService.create(req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        allocationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
