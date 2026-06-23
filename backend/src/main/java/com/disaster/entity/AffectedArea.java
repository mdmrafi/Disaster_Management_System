package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Geographic area affected by a Disaster.
 * Relationship: many AffectedArea -> 1 Disaster; 1 Area -> many Camp.
 */
@Entity
@Table(name = "affected_area")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AffectedArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area_id")
    private Long areaId;

    @Column(name = "area_name", nullable = false, length = 150)
    private String areaName;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "population", nullable = false)
    private Integer population;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "disaster_id", nullable = false)
    private Disaster disaster;

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = false)
    @Builder.Default
    private List<ReliefCamp> camps = new ArrayList<>();
}
