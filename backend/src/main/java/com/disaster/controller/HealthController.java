package com.disaster.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * /api/health — liveness probe used by Render's {@code healthCheckPath}.
 *
 * <p>Deliberately unauthenticated (see {@code SecurityConfig}) so the platform
 * can poll it without a token. It only reports that the process is serving
 * traffic; the app already fails fast at startup if the datasource is
 * unreachable, so reaching this endpoint implies the DB wiring is sound.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
