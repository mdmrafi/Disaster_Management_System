package com.disaster.dto;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardSummary {
    private long totalDisasters;
    private long activeCamps;
    private long totalVictims;
    private long urgentShortageCount;
    private List<ShortageReport> urgentCamps;
}
