package com.disaster.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReliefCampResponse {
    private Long campId;
    private String campName;
    private String location;
    private Integer capacity;
    private Integer currentOccupancy;
    private Long areaId;
    private String areaName;
    private Long disasterId;
    private String disasterName;
}
