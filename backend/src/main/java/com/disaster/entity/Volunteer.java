package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

/** Person offering help. Status changes via VolunteerService. */
@Entity
@Table(name = "volunteer")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "volunteer_id")
    private Long volunteerId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "phone", nullable = false, length = 30)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialization", nullable = false)
    private Specialization specialization;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    @Builder.Default
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;
}
