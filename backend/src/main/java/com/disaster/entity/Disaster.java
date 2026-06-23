package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Top-level event: flood, cyclone, earthquake, etc.
 *
 * Relationship: 1 Disaster -> many AffectedArea.
 */
@Entity
@Table(name = "disaster")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Disaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disaster_id")
    private Long disasterId;

    @Column(name = "disaster_name", nullable = false, length = 150)
    private String disasterName;

    @Enumerated(EnumType.STRING)
    @Column(name = "disaster_type", nullable = false)
    private DisasterType disasterType;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity_level", nullable = false)
    private SeverityLevel severityLevel;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "disaster", cascade = CascadeType.ALL, orphanRemoval = false)
    @Builder.Default
    private List<AffectedArea> affectedAreas = new ArrayList<>();
}
