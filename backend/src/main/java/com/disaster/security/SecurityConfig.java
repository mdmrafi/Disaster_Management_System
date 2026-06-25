package com.disaster.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Stateless JWT security.
 *
 * <ul>
 *   <li>{@code /api/auth/login} and {@code /error} are public.</li>
 *   <li>Everything else under {@code /api/**} requires a valid bearer token.</li>
 *   <li>CSRF is disabled (no browser-form auth).</li>
 *   <li>CORS delegates to the existing {@link CorsConfigurationSource} bean.</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtFilter;
    private final JsonAuthEntryPoint entryPoint;

    public SecurityConfig(JwtAuthFilter jwtFilter, JsonAuthEntryPoint entryPoint) {
        this.jwtFilter = jwtFilter;
        this.entryPoint = entryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/login", "/error").permitAll()
                    .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
