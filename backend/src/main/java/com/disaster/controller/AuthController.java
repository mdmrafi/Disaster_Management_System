package com.disaster.controller;

import com.disaster.dto.LoginRequest;
import com.disaster.dto.LoginResponse;
import com.disaster.dto.UserDto;
import com.disaster.entity.User;
import com.disaster.repository.UserRepository;
import com.disaster.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final UserRepository users;

    public AuthController(AuthService auth, UserRepository users) {
        this.auth = auth;
        this.users = users;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return auth.login(req);
    }

    @GetMapping("/me")
    public UserDto me(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        String email = String.valueOf(authentication.getPrincipal());
        User user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unknown user"));
        return auth.toDto(user);
    }
}
