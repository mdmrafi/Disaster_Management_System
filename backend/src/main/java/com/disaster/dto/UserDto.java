package com.disaster.dto;

import com.disaster.entity.UserRole;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDto {
    private Long id;
    private String email;
    private String displayName;
    private UserRole role;
}
