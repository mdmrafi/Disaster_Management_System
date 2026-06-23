package com.disaster.controller;

import com.disaster.dto.AffectedAreaRequest;
import com.disaster.dto.AffectedAreaResponse;
import com.disaster.service.AffectedAreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/areas — CRUD for affected areas. Supports ?disasterId=... filter. */
@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AffectedAreaController {

    private final AffectedAreaService areaService;

    @GetMapping
    public List<AffectedAreaResponse> list(@RequestParam(value = "disasterId", required = false) Long disasterId) {
        if (disasterId != null) {
            return areaService.findByDisaster(disasterId);
        }
        return areaService.findAll();
    }

    @GetMapping("/{id}")
    public AffectedAreaResponse get(@PathVariable Long id) {
        return areaService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AffectedAreaResponse create(@Valid @RequestBody AffectedAreaRequest req) {
        return areaService.create(req);
    }

    @PutMapping("/{id}")
    public AffectedAreaResponse update(@PathVariable Long id,
                                       @Valid @RequestBody AffectedAreaRequest req) {
        return areaService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        areaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
