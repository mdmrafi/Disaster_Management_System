package com.disaster.entity;

/**
 * Role granted to an authenticated user.
 * ADMIN     — full read/write across the system
 * OPERATOR  — day-to-day relief-ops staff
 * VIEWER    — read-only (auditors, partner NGOs)
 */
public enum UserRole {
    ADMIN,
    OPERATOR,
    VIEWER
}
