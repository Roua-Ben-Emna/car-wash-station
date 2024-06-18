package com.isi.carwash.Repository;

import com.isi.carwash.Entity.CarWashSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarWashSessionRepository extends JpaRepository<CarWashSession, Long> {
    List<CarWashSession> findByCarWashStationId(Long stationId);
    List<CarWashSession> findByCarWashStationIdAndStatus(Long stationId, String status);
    List<CarWashSession> findByCarUserId(Long userId);
}
