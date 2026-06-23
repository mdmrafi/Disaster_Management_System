package com.disaster.dto;

import com.disaster.entity.PriorityLevel;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VictimResponse {
    private Long victimId;
    private String name;
    private Integer age;
    private String gender;
    private Integer familyMembers;
    private PriorityLevel priorityLevel;
    private String medicalCondition;
    private Long campId;
    private String campName;
}
