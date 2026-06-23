package com.disaster.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AffectedAreaResponse {
    private Long areaId;
    private String areaName;
    private String district;
    private Integer population;
    private Long disasterId;
    private String disasterName;
}
