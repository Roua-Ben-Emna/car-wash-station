package com.isi.carwash.Repository;

import com.isi.carwash.Entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    @Query("SELECT c FROM Car c JOIN CarWashSession s ON c.id = s.carId WHERE s.stationId = :stationId")
    List<Car> findAllByStationId(Long stationId);
}
