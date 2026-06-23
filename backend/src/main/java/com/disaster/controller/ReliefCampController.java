package com.disaster.controller;

import com.disaster.dto.ReliefCampRequest;
import com.disaster.dto.ReliefCampResponse;
import com.disaster.service.ReliefCampService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/camps — CRUD for relief camps. Supports ?areaId=... filter. */
@RestController
@RequestMapping("/api/camps")
@RequiredArgsConstructor
public class ReliefCampController {

    private final ReliefCampService campService;

    @GetMapping
    public List<ReliefCampResponse> list(@RequestParam(value = "areaId", required = false) Long areaId) {
        if (areaId != null) {
            return campService.findByArea(areaId);
        }
        return campService.findAll();
    }

    @GetMapping("/{id}")
    public ReliefCampResponse get(@PathVariable Long id) {
        return campService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReliefCampResponse create(@Valid @RequestBody ReliefCampRequest req) {
        return campService.create(req);
    }

    @PutMapping("/{id}")
    public ReliefCampResponse update(@PathVariable Long id,
                                     @Valid @RequestBody ReliefCampRequest req) {
        return campService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        campService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
