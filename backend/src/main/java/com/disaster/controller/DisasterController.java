package com.disaster.controller;

import com.disaster.dto.DisasterRequest;
import com.disaster.dto.DisasterResponse;
import com.disaster.service.DisasterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/disasters — full CRUD for the top-level disaster entity. */
@RestController
@RequestMapping("/api/disasters")
@RequiredArgsConstructor
public class DisasterController {

    private final DisasterService disasterService;

    @GetMapping
    public List<DisasterResponse> list() {
        return disasterService.findAll();
    }

    @GetMapping("/{id}")
    public DisasterResponse get(@PathVariable Long id) {
        return disasterService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DisasterResponse create(@Valid @RequestBody DisasterRequest req) {
        return disasterService.create(req);
    }

    @PutMapping("/{id}")
    public DisasterResponse update(@PathVariable Long id,
                                   @Valid @RequestBody DisasterRequest req) {
        return disasterService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        disasterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
