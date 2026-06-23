package com.disaster.dto;

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

    @NotNull
    private Long disasterId;
}
