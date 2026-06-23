package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Join entity for the M:N relationship between Volunteer and ReliefCamp.
 * UNIQUE(volunteer_id, camp_id) is enforced at the DB level — duplicate
 * assignment attempts will fail in the service layer first with a clear error.
 */
@Entity
@Table(name = "volunteer_assignment",
       uniqueConstraints = @UniqueConstraint(name = "uq_va_volunteer_camp",
                                             columnNames = {"volunteer_id", "camp_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VolunteerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "camp_id", nullable = false)
    private ReliefCamp camp;

    @Column(name = "duty_hours")
    private Integer dutyHours;

    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;
}
