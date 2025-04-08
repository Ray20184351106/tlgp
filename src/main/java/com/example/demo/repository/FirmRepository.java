package com.example.demo.repository;

import com.example.demo.entity.Firm;
import org.springframework.data.jpa.repository.JpaRepository;

// src/main/java/com/example/demo/repository/FirmRepository.java
public interface FirmRepository extends JpaRepository<Firm, Long> {
}
