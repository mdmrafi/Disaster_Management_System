package com.disaster.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DonationRequest {

    @NotBlank @Size(max = 150)
    private String donorName;

    @NotNull
    private LocalDate donationDate;

    @NotNull
    private Long disasterId;

    @NotNull
    private Long resourceId;

    @NotNull @Min(1)
    private Integer quantity;
}
