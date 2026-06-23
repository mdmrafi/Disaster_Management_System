package com.disaster.dto;

import com.disaster.entity.DisasterType;
import com.disaster.entity.SeverityLevel;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisasterResponse {
    private Long disasterId;
    private String disasterName;
    private DisasterType disasterType;
    private SeverityLevel severityLevel;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
}
