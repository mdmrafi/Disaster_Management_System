package com.disaster.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Application login account.
 *
 * <p>Table name is {@code app_user} (not {@code user}, which is reserved in many
 * SQL dialects). Passwords are stored as BCrypt hashes only — the plaintext is
 * never written or logged.</p>
 */
@Entity
@Table(name = "app_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 200)
    private String passwordHash;

    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
