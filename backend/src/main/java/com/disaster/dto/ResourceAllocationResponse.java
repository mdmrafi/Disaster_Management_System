package com.disaster.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResourceAllocationResponse {
    private Long allocationId;
    private Long campId;
    private String campName;
    private Long resourceId;
    private String resourceName;
    private Integer quantity;
    private LocalDate allocationDate;
}
