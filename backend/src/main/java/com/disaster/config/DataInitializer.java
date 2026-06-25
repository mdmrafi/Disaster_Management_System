package com.disaster.config;

import com.disaster.entity.User;
import com.disaster.entity.UserRole;
import com.disaster.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the initial admin account on first startup.
 *
 * <p>Only runs when the {@code app_user} table is empty, so it is safe to keep
 * across restarts. The seed credentials are dev-only and printed to the log
 * exactly once.</p>
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String SEED_EMAIL = "admin@resilience.local";
    private static final String SEED_PASSWORD = "admin123";
    private static final String SEED_NAME = "System Administrator";

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public DataInitializer(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (users.count() > 0) {
            return;
        }
        User admin = User.builder()
                .email(SEED_EMAIL)
                .passwordHash(encoder.encode(SEED_PASSWORD))
                .displayName(SEED_NAME)
                .role(UserRole.ADMIN)
                .build();
        users.save(admin);
        log.warn("=================================================================");
        log.warn(" Seeded initial admin user");
        log.warn("   email:    {}", SEED_EMAIL);
        log.warn("   password: {}", SEED_PASSWORD);
        log.warn(" CHANGE THIS PASSWORD BEFORE ANY NON-DEV DEPLOYMENT.");
        log.warn("=================================================================");
    }
}
