package com.disaster.dto;

import com.disaster.entity.CampStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReliefCampRequest {

    @NotBlank @Size(max = 150)
    private String campName;

    @NotBlank @Size(max = 200)
    private String location;

    @NotNull @Min(1)
    private Integer capacity;

    @DecimalMin("-90.0")  @DecimalMax("90.0")
    private Double latitude;

    @DecimalMin("-180.0") @DecimalMax("180.0")
    private Double longitude;

    private CampStatus status;

    @NotNull
    private Long areaId;
}
