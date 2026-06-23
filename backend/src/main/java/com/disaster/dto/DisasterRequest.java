package com.disaster.dto;

import com.disaster.entity.DisasterType;
import com.disaster.entity.SeverityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisasterRequest {

    @NotBlank @Size(max = 150)
    private String disasterName;

    @NotNull
    private DisasterType disasterType;

    @NotNull
    private SeverityLevel severityLevel;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 5000)
    private String description;
}
