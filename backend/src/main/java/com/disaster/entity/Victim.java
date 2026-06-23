package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

/** Person registered in a relief camp. priority_level drives allocation. */
@Entity
@Table(name = "victim")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Victim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "victim_id")
    private Long victimId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false, length = 20)
    private String gender;

    @Column(name = "family_members", nullable = false)
    @Builder.Default
    private Integer familyMembers = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level", nullable = false)
    private PriorityLevel priorityLevel;

    @Column(name = "medical_condition", columnDefinition = "TEXT")
    private String medicalCondition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "camp_id", nullable = false)
    private ReliefCamp camp;
}
