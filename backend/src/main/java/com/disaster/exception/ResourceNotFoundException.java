package com.disaster.exception;

/** Thrown when a referenced entity does not exist. Maps to 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}
