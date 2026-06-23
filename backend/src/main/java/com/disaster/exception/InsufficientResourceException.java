package com.disaster.exception;

/**
 * Thrown when an allocation request exceeds the resource's available stock.
 * Maps to 409 with a specific error code so the frontend can show a clear message.
 */
public class InsufficientResourceException extends RuntimeException {
    public InsufficientResourceException(String message) { super(message); }
}
