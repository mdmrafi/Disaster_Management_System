package com.disaster.security;

import com.disaster.entity.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * Issues and verifies HS256 JWTs.
 *
 * <p>Token claims:
 * <ul>
 *   <li>{@code sub} — user email</li>
 *   <li>{@code uid} — numeric user id</li>
 *   <li>{@code role} — {@link UserRole} name (drives {@code ROLE_*} authorities)</li>
 *   <li>{@code iat} / {@code exp} — standard timestamps</li>
 * </ul>
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-ms:86400000}") long expirationMs) {
        // HS256 needs >= 32 bytes; trim just in case the property has whitespace.
        byte[] bytes = secret.trim().getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(bytes);
        this.expirationMs = expirationMs;
    }

    public String issue(Long userId, String email, UserRole role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(email)
                .claim("uid", userId)
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(key)
                .compact();
    }

    /** Throws on invalid signature, expiry, or malformed token. */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpirationMs() {
        return expirationMs;
    }
}
