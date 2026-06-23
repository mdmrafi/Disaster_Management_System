package com.disaster.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DonationResponse {
    private Long donationId;
    private String donorName;
    private LocalDate donationDate;
    private Long disasterId;
    private String disasterName;
    private Long resourceId;
    private String resourceName;
    private Integer quantity;
}
