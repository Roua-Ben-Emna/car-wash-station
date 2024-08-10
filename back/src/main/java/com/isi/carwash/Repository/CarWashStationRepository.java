package com.isi.carwash.Repository;

import com.isi.carwash.Entity.CarWashStation;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarWashStationRepository extends JpaRepository<CarWashStation, Long> {

List<CarWashStation> findByNameContainingIgnoreCase(String name);
    List<CarWashStation> findByManagerId(Long userId);

}