package com.disaster.repository;

import com.disaster.entity.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisasterRepository extends JpaRepository<Disaster, Long> {
}
