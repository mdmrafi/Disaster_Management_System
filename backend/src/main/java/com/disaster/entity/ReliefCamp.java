package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Relief camp. current_occupancy is derived in the VictimService;
 * never set directly via the camp API. DB CHECK constraint is a backstop.
 */
@Entity
@Table(name = "relief_camp")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReliefCamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "camp_id")
    private Long campId;

    @Column(name = "camp_name", nullable = false, length = 150)
    private String campName;

    @Column(name = "location", nullable = false, length = 200)
    private String location;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "current_occupancy", nullable = false)
    @Builder.Default
    private Integer currentOccupancy = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "area_id", nullable = false)
    private AffectedArea area;
}
