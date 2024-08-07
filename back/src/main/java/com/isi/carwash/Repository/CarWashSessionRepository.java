package com.isi.carwash.Repository;

import com.isi.carwash.Entity.CarWashSession;
import com.isi.carwash.Entity.CarWashStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CarWashSessionRepository extends JpaRepository<CarWashSession, Long> {
    List<CarWashSession> findByCarWashStationId(Long stationId);
    List<CarWashSession> findByCarWashStationIdAndStatus(Long stationId, String status);
    List<CarWashSession> findByCarUserId(Long userId);
    @Query("SELECT COUNT(session) FROM CarWashSession session WHERE session.carWashStation.id = :stationId AND session.washDate = :washDate AND session.status = :status")
    long countByCarWashStationIdAndWashDateAndStatus(@Param("stationId") Long stationId, @Param("washDate") Date washDate, @Param("status") String status);


    List<CarWashSession> findByCarWashStationAndWashDate(CarWashStation carWashStation, Date washDate);
    List<CarWashSession> findByCarWashStationAndWashDateBetween(CarWashStation carWashStation, Date start, Date end);

    @Query("SELECT c FROM CarWashSession c WHERE c.carWashStation.id = :stationId AND c.status IN :statuses")
    List<CarWashSession> findSessionsInProgressOrPending(@Param("stationId") Long stationId, @Param("statuses") List<String> statuses);


}
