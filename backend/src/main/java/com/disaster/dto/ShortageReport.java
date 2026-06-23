package com.disaster.dto;

import lombok.*;

import java.util.List;

/**
 * Per-camp shortage report. A camp appears in the report when at least
 * one of the three conditions (food, medical, essential-threshold) holds.
 * "urgent" is set when 2+ conditions hold, or any HIGH-priority victim
 * exists with at least one condition.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShortageReport {
    private Long campId;
    private String campName;
    private String areaName;
    private String disasterName;
    private Integer currentOccupancy;
    private long highPriorityVictims;
    private long medicalCases;
    private List<String> triggeredConditions;
    private boolean urgent;
    private String reason;
}
