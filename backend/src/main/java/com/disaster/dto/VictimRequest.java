package com.disaster.dto;

import com.disaster.entity.PriorityLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VictimRequest {

    @NotBlank @Size(max = 150)
    private String name;

    @NotNull @Min(0)
    private Integer age;

    @NotBlank @Size(max = 20)
    private String gender;

    @Min(0)
    private Integer familyMembers;

    @NotNull
    private PriorityLevel priorityLevel;

    @Size(max = 5000)
    private String medicalCondition;

    @NotNull
    private Long campId;
}
