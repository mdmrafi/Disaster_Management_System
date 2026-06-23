package com.disaster.dto;

import com.disaster.entity.ResourceCategory;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResourceResponse {
    private Long resourceId;
    private String resourceName;
    private ResourceCategory category;
    private Integer totalQuantity;
    private Integer availableQuantity;
}
