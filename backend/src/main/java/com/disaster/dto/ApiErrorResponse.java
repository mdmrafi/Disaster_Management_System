package com.disaster.dto;

import lombok.*;

import java.time.Instant;
import java.util.List;

/** Standard JSON shape returned by GlobalExceptionHandler. */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApiErrorResponse {
    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;
}
