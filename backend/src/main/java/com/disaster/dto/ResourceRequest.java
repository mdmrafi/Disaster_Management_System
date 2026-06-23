package com.disaster.dto;

import com.disaster.entity.ResourceCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResourceRequest {

    @NotBlank @Size(max = 150)
    private String resourceName;

    @NotNull
    private ResourceCategory category;

    /**
     * Initial seed for both total_quantity and available_quantity.
     * May be 0 — the resource is created empty and topped up via donations.
     */
    @NotNull @Min(0)
    private Integer initialQuantity;
}
