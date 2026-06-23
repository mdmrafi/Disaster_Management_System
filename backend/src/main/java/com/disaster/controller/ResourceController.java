package com.disaster.controller;

import com.disaster.dto.ResourceRequest;
import com.disaster.dto.ResourceResponse;
import com.disaster.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/resources — CRUD for resources. */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public List<ResourceResponse> list() {
        return resourceService.findAll();
    }

    @GetMapping("/{id}")
    public ResourceResponse get(@PathVariable Long id) {
        return resourceService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceResponse create(@Valid @RequestBody ResourceRequest req) {
        return resourceService.create(req);
    }

    @PutMapping("/{id}")
    public ResourceResponse update(@PathVariable Long id,
                                   @Valid @RequestBody ResourceRequest req) {
        return resourceService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
