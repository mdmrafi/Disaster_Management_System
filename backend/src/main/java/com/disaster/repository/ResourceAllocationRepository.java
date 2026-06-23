package com.disaster.repository;

import com.disaster.entity.ResourceAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceAllocationRepository extends JpaRepository<ResourceAllocation, Long> {

    /**
     * Sum of allocated (and therefore "available at the camp")
     * quantity for a given camp + category. This is the running
     * outstanding stock at the camp — not the central warehouse stock.
     * The shortage engine uses this for medical-shortage and per-category
     * threshold checks.
     */
    @Query("""
           SELECT COALESCE(SUM(a.quantity), 0)
             FROM ResourceAllocation a
            WHERE a.camp.campId = :campId
              AND a.resource.category = :category
           """)
    long sumAllocatedQuantityByCampAndCategory(
            @Param("campId") Long campId,
            @Param("category") com.disaster.entity.ResourceCategory category);

    List<ResourceAllocation> findByCampCampId(Long campId);
}
