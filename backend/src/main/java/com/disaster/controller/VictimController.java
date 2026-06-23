package com.disaster.controller;

import com.disaster.dto.VictimRequest;
import com.disaster.dto.VictimResponse;
import com.disaster.service.VictimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** /api/victims — CRUD for victims. Supports ?campId=... filter. */
@RestController
@RequestMapping("/api/victims")
@RequiredArgsConstructor
public class VictimController {

    private final VictimService victimService;

    @GetMapping
    public List<VictimResponse> list(@RequestParam(value = "campId", required = false) Long campId) {
        if (campId != null) {
            return victimService.findByCamp(campId);
        }
        return victimService.findAll();
    }

    @GetMapping("/{id}")
    public VictimResponse get(@PathVariable Long id) {
        return victimService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VictimResponse create(@Valid @RequestBody VictimRequest req) {
        return victimService.register(req);
    }

    @PutMapping("/{id}")
    public VictimResponse update(@PathVariable Long id,
                                 @Valid @RequestBody VictimRequest req) {
        return victimService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        victimService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
