package com.disaster.dto;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardSummary {
    private long activeDisasters;
    private long campCount;
    private long victimCount;
    private long urgentShortageCount;
    private List<ShortageReport> urgentShortages;
}
