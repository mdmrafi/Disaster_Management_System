package com.disaster.repository;

import com.disaster.entity.CampStatus;
import com.disaster.entity.ReliefCamp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReliefCampRepository extends JpaRepository<ReliefCamp, Long> {
    List<ReliefCamp> findByAreaAreaId(Long areaId);

    long countByStatus(CampStatus status);
}
