package com.disaster.repository;

import com.disaster.entity.AffectedArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AffectedAreaRepository extends JpaRepository<AffectedArea, Long> {
    List<AffectedArea> findByDisasterDisasterId(Long disasterId);
}
