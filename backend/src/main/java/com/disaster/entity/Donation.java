package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/** Incoming stock record. The trg_donation_update_stock trigger updates the linked Resource. */
@Entity
@Table(name = "donation")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id")
    private Long donationId;

    @Column(name = "donor_name", nullable = false, length = 150)
    private String donorName;

    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "disaster_id", nullable = false)
    private Disaster disaster;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
