package com.disaster.repository;

import com.disaster.entity.VolunteerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VolunteerAssignmentRepository extends JpaRepository<VolunteerAssignment, Long> {

    List<VolunteerAssignment> findByVolunteerVolunteerId(Long volunteerId);

    List<VolunteerAssignment> findByCampCampId(Long campId);

    Optional<VolunteerAssignment> findByVolunteerVolunteerIdAndCampCampId(Long volunteerId, Long campId);
}
