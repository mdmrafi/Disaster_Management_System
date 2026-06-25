package com.disaster.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private long expiresInMs;
    private UserDto user;
}
