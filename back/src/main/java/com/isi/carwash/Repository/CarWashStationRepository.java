package com.isi.carwash.Repository;

import com.isi.carwash.Entity.CarWashStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarWashStationRepository extends JpaRepository<CarWashStation, Long> {
//    @Query("SELECT c FROM CarWashStation c WHERE " +
//            "SQRT(POW(c.latitude - :latitude, 2) + POW(c.longitude - :longitude, 2)) <= :distance")
//    List<CarWashStation> findByProximateLocation(@Param("latitude") double latitude,
//                                                 @Param("longitude") double longitude,
//                                                 @Param("distance") double distance);
List<CarWashStation> findByNameContainingIgnoreCase(String name);


}