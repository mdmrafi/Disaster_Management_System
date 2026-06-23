package com.disaster.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VolunteerAssignmentRequest {

    private Long volunteerId;

    @NotNull
    private Long campId;

    @Min(0)
    private Integer dutyHours;

    @NotNull
    private LocalDate assignedDate;
}
