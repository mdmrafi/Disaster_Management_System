package com.disaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Disaster Management REST API.
 *
 * Layered architecture:
 *   controller -> service -> repository -> entity
 *
 * The service layer is the source of truth for business rules
 * (capacity checks, stock arithmetic, shortage logic). DB triggers
 * (see /db/triggers.sql) are backstops for inserts that bypass
 * the service layer.
 */
@SpringBootApplication
public class DisasterManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(DisasterManagementApplication.class, args);
    }
}
