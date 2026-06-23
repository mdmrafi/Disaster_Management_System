package com.disaster.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VolunteerAssignmentResponse {
    private Long assignmentId;
    private Long volunteerId;
    private String volunteerName;
    private Long campId;
    private String campName;
    private Integer dutyHours;
    private LocalDate assignedDate;
}
