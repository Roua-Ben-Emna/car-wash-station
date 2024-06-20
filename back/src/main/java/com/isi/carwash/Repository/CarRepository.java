package com.isi.carwash.Repository;

import com.isi.carwash.Entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    @Query("SELECT c FROM Car c JOIN CarWashSession s ON c.id = s.car.id WHERE s.carWashStation.id = :station_id")
    List<Car> findAllByStationId(Long station_id);
    List<Car> findByUserId(Long userId);
    List<Car> findByMakeAndModel(String make, String model);

}
