package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Pool of a single kind of supply. available_quantity is the running balance:
 *   +quantity on donation, -quantity on allocation.
 *   Application never writes available_quantity directly (option a in the spec).
 *   The DB trigger does the arithmetic, and the service layer refreshes the entity.
 */
@Entity
@Table(name = "resource")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resource_id")
    private Long resourceId;

    @Column(name = "resource_name", nullable = false, length = 150)
    private String resourceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private ResourceCategory category;

    @Column(name = "total_quantity", nullable = false)
    @Builder.Default
    private Integer totalQuantity = 0;

    @Column(name = "available_quantity", nullable = false)
    @Builder.Default
    private Integer availableQuantity = 0;
}
