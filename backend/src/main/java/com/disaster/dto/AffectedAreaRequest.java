package com.disaster.dto;

import com.disaster.entity.SeverityLevel;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AffectedAreaRequest {

    @NotBlank @Size(max = 150)
    private String areaName;

    @NotBlank @Size(max = 100)
    private String district;

    @NotNull @Min(0)
    private Integer population;

    @DecimalMin("-90.0")  @DecimalMax("90.0")
    private Double latitude;

    @DecimalMin("-180.0") @DecimalMax("180.0")
    private Double longitude;

    private SeverityLevel severity;

    @NotNull
    private Long disasterId;
}
