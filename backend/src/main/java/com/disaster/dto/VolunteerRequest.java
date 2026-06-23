package com.disaster.dto;

import com.disaster.entity.Specialization;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VolunteerRequest {

    @NotBlank @Size(max = 150)
    private String name;

    @NotBlank @Size(max = 30)
    private String phone;

    @NotNull
    private Specialization specialization;
}
