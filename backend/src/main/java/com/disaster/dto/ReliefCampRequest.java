package com.disaster.dto;

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

    @NotNull
    private Long areaId;
}
