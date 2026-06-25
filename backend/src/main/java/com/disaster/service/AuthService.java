package com.disaster.service;

import com.disaster.dto.LoginRequest;
import com.disaster.dto.LoginResponse;
import com.disaster.dto.UserDto;
import com.disaster.entity.User;
import com.disaster.repository.UserRepository;
import com.disaster.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public LoginResponse login(LoginRequest req) {
        User user = users.findByEmail(req.getEmail())
                .orElseThrow(this::invalidCredentials);

        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw invalidCredentials();
        }

        String token = jwt.issue(user.getUserId(), user.getEmail(), user.getRole());
        return LoginResponse.builder()
                .token(token)
                .expiresInMs(jwt.getExpirationMs())
                .user(toDto(user))
                .build();
    }

    public UserDto toDto(User u) {
        return UserDto.builder()
                .id(u.getUserId())
                .email(u.getEmail())
                .displayName(u.getDisplayName())
                .role(u.getRole())
                .build();
    }

    private ResponseStatusException invalidCredentials() {
        // Generic message — don't leak which field was wrong.
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
}
