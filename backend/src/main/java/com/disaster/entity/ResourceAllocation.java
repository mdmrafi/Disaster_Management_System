package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/** Outgoing stock record (camp receives resources). */
@Entity
@Table(name = "resource_allocation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResourceAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allocation_id")
    private Long allocationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "camp_id", nullable = false)
    private ReliefCamp camp;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "allocation_date", nullable = false)
    private LocalDate allocationDate;
}
