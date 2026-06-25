package com.disaster.entity;

/**
 * Operating status of a relief camp.
 *
 * <ul>
 *   <li>{@link #ACTIVE}  — accepting new arrivals</li>
 *   <li>{@link #FULL}    — at capacity, diverting new arrivals elsewhere</li>
 *   <li>{@link #CLOSED}  — decommissioned, retained for record only</li>
 * </ul>
 */
public enum CampStatus {
    ACTIVE,
    FULL,
    CLOSED
}
