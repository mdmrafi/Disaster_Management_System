package com.disaster.dto;

import com.disaster.entity.AvailabilityStatus;
import com.disaster.entity.Specialization;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VolunteerResponse {
    private Long volunteerId;
    private String name;
    private String phone;
    private String email;
    private Specialization specialization;
    private AvailabilityStatus availabilityStatus;
}
