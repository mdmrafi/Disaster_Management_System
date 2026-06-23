package com.disaster.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResourceAllocationRequest {

    @NotNull
    private Long campId;

    @NotNull
    private Long resourceId;

    @NotNull @Min(1)
    private Integer quantity;

    @NotNull
    private LocalDate allocationDate;
}
