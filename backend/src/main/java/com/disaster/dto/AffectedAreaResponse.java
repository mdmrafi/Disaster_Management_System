package com.disaster.dto;

import com.disaster.entity.SeverityLevel;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AffectedAreaResponse {
    private Long areaId;
    private String areaName;
    private String district;
    private Integer population;
    private Double latitude;
    private Double longitude;
    private SeverityLevel severity;
    private Long disasterId;
    private String disasterName;
}
