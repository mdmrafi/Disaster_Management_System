package com.disaster.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Reads {@code Authorization: Bearer <jwt>}, validates it, and populates the
 * {@link SecurityContextHolder} with an authenticated principal (email) and a
 * single {@code ROLE_*} authority derived from the {@code role} claim.
 *
 * <p>If the header is missing or the token is invalid the filter is silent —
 * downstream authorization will return 401 via {@link JsonAuthEntryPoint}.</p>
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader(HEADER);
        if (header != null && header.startsWith(PREFIX)) {
            String token = header.substring(PREFIX.length()).trim();
            try {
                Claims claims = jwt.parse(token);
                String email = claims.getSubject();
                String role = claims.get("role", String.class);
                if (email != null && role != null
                        && SecurityContextHolder.getContext().getAuthentication() == null) {
                    var authority = new SimpleGrantedAuthority("ROLE_" + role);
                    var auth = new UsernamePasswordAuthenticationToken(
                            email, null, List.of(authority));
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ignored) {
                // bad/expired token — leave context anonymous; protected routes
                // will be rejected by the entry point
            }
        }

        chain.doFilter(request, response);
    }
}
