package com.disaster.repository;

import com.disaster.entity.PriorityLevel;
import com.disaster.entity.Victim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VictimRepository extends JpaRepository<Victim, Long> {

    List<Victim> findByCampCampId(Long campId);

    List<Victim> findByCampCampIdAndPriorityLevel(Long campId, PriorityLevel priority);

    /**
     * Count of victims in a camp grouped by priority.
     * Used by the shortage engine and the allocation ordering logic.
     * Returns rows of (priority_level, cnt).
     */
    @Query("""
           SELECT v.priorityLevel AS priority, COUNT(v) AS cnt
             FROM Victim v
            WHERE v.camp.campId = :campId
            GROUP BY v.priorityLevel
           """)
    List<PriorityCount> countByPriorityForCamp(@Param("campId") Long campId);

    @Query("""
           SELECT COUNT(v) FROM Victim v
            WHERE v.camp.campId = :campId
              AND v.medicalCondition IS NOT NULL
           """)
    long countMedicalCasesInCamp(@Param("campId") Long campId);

    /** Projection used by countByPriorityForCamp. */
    interface PriorityCount {
        PriorityLevel getPriority();
        long getCnt();
    }
}
