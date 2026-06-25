package com.disaster.repository;

import com.disaster.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Native UPDATE used by DonationService / AllocationService so the
     * trigger remains the single point of stock arithmetic. We then
     * refresh the entity from the DB so Hibernate's in-memory copy
     * reflects the new total/available values.
     */
    @Modifying
    @Query(value = "UPDATE resource " +
                   "SET available_quantity = available_quantity + :delta, " +
                   "    total_quantity     = total_quantity     + :delta " +
                   "WHERE resource_id = :resourceId",
           nativeQuery = true)
    int applyDonationDelta(@Param("resourceId") Long resourceId, @Param("delta") int delta);

    @Modifying
    @Query(value = "UPDATE resource " +
                   "SET available_quantity = available_quantity - :qty " +
                   "WHERE resource_id = :resourceId",
           nativeQuery = true)
    int applyAllocationDelta(@Param("resourceId") Long resourceId, @Param("qty") int qty);

    @Query("SELECT COALESCE(SUM(r.availableQuantity), 0) FROM Resource r")
    long sumAvailableQuantity();
}
