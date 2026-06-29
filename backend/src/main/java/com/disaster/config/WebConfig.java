package com.disaster.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CORS configuration.
 *
 * <p>This project uses Option A (decoupled) from the spec: the React app
 * runs on its own origin (http://localhost:5173 in dev) and the Spring
 * Boot API runs on http://localhost:8080. The allowed origins come from
 * the {@code app.cors.allowed-origins} property, which in turn reads the
 * {@code APP_CORS_ALLOWED_ORIGINS} environment variable. That makes the
 * same image deployable to any environment (local, Render, etc.) without
 * rebuilding.
 *
 * <p>Two beans are exposed on purpose:
 * <ul>
 *   <li>{@link WebMvcConfigurer} — drives MVC-level CORS (controller annotations)</li>
 *   <li>{@link CorsConfigurationSource} — drives Spring Security's CORS filter</li>
 * </ul>
 */
@Configuration
public class WebConfig {

    private final List<String> allowedOrigins;

    public WebConfig(@Value("${app.cors.allowed-origins}") String allowedOriginsCsv) {
        this.allowedOrigins = Arrays.stream(allowedOriginsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins.toArray(new String[0]))
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type", "Accept")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(allowedOrigins);
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cfg);
        return source;
    }
}
