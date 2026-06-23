package com.disaster.exception;

/**
 * Thrown for violated business rules (camp full, duplicate assignment, etc.).
 * Maps to 409 Conflict.
 */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) { super(message); }
}
