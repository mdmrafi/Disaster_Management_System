package com.disaster.controller;

import com.disaster.dto.ShortageReport;
import com.disaster.service.ShortageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** /api/shortages — shortage detection (read-only). */
@RestController
@RequestMapping("/api/shortages")
@RequiredArgsConstructor
public class ShortageController {

    private final ShortageService shortageService;

    /** All camps currently flagged with any shortage condition. */
    @GetMapping
    public List<ShortageReport> all() {
        return shortageService.computeReports();
    }

    /** Subset that should be acted on urgently. */
    @GetMapping("/urgent")
    public List<ShortageReport> urgent() {
        return shortageService.findUrgentShortages();
    }
}
