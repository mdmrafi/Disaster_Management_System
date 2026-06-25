package com.disaster.repository;

import com.disaster.entity.AvailabilityStatus;
import com.disaster.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    long countByAvailabilityStatus(AvailabilityStatus status);

    List<Volunteer> findByAvailabilityStatus(AvailabilityStatus status);
}
