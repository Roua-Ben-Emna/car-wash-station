package com.isi.carwash.Service.session;

import com.isi.carwash.Entity.CarWashSession;

import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Repository.CarWashSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Optional;


@Service
public class CarWashSessionService {

    @Autowired
    private CarWashSessionRepository carWashSessionRepository;


    public Duration calculateEstimatedWaitTime(Long sessionId) {
        CarWashSession session = getCarWashSessionById(sessionId);
        CarWashStation station = session.getCarWashStation();
        List<CarWashSession> sessionsInProgress = getInProgressSessionsByStationId(station.getId());
        long totalWaitTimeMinutes = 0;

        for (CarWashSession sessionInProgress : sessionsInProgress) {
            Duration estimatedWashDuration = sessionInProgress.getEstimatedWashDuration();
            totalWaitTimeMinutes += estimatedWashDuration.toMinutes();
        }
        return Duration.ofMinutes(totalWaitTimeMinutes);
    }
    public Duration calculateEstimatedWashDuration(Long sessionId, String washType, String carType) {
        CarWashSession session = getCarWashSessionById(sessionId);

        double baseDuration = 0;
        if ("EXTERIOR".equalsIgnoreCase(washType)) {
            baseDuration = session.getCarWashStation().getEstimateTypeExterior().toMinutes();
        } else if ("INTERIOR".equalsIgnoreCase(washType)) {
            baseDuration = session.getCarWashStation().getEstimateTypeInterior().toMinutes();
        } else if ("EXTERIOR_INTERIOR".equalsIgnoreCase(washType)) {
            baseDuration = session.getCarWashStation().getEstimateTypeExteriorInterior().toMinutes();
        }

        if ("SMALL".equalsIgnoreCase(carType)) {
            baseDuration *= session.getCarWashStation().getEstimateCarSmall().toMinutes();
        } else if ("MEDIUM".equalsIgnoreCase(carType)) {
            baseDuration *= session.getCarWashStation().getEstimateCarMedium().toMinutes();
        } else if ("LARGE".equalsIgnoreCase(carType)) {
            baseDuration *= session.getCarWashStation().getEstimateCarLarge().toMinutes();
        }

        return Duration.ofMinutes((long) baseDuration);
    }

    public CarWashSession createCarWashSession(CarWashSession carWashSession) {
        carWashSessionRepository.save(carWashSession);
        carWashSession.setStatus("In Progress");
        carWashSession.setEstimatedWaitTime(calculateEstimatedWaitTime(carWashSession.getId()));
        carWashSession.setEstimatedWashDuration(calculateEstimatedWashDuration(carWashSession.getId(), carWashSession.getWashType().name(), carWashSession.getCar().getSize().name()));
        carWashSession.getCarWashStation().setCurrentCarsInWash( carWashSession.getCarWashStation().getCurrentCarsInWash()+1);
        return carWashSessionRepository.save(carWashSession);
    }

    public List<CarWashSession> getAllCarWashSessions() {
        return carWashSessionRepository.findAll();
    }

    public CarWashSession getCarWashSessionById(Long sessionId) {
        Optional<CarWashSession> sessionOptional = carWashSessionRepository.findById(sessionId);
        if (sessionOptional.isPresent()) {
            return sessionOptional.get();
        } else {
            throw new RuntimeException("Car Wash Session not found");
        }
    }

    public List<CarWashSession> getCarWashSessionByStationId(Long stationId) {
        return carWashSessionRepository.findByCarWashStationId(stationId);
    }

    public List<CarWashSession> getAllSessionsByUser(Long userId) {
        return carWashSessionRepository.findByCarUserId(userId);
    }
    public List<CarWashSession> getInProgressSessionsByStationId(Long stationId) {
        return carWashSessionRepository.findByCarWashStationIdAndStatus(stationId, "in progress");
    }

    public CarWashSession updateCarWashSession(Long id, CarWashSession carWashSession) {
        Optional<CarWashSession> existingSession = carWashSessionRepository.findById(id);
        if (existingSession.isPresent()) {
            CarWashSession sessionToUpdate = existingSession.get();
            sessionToUpdate.setWashTime(carWashSession.getWashTime());
            sessionToUpdate.setWashType(carWashSession.getWashType());
            sessionToUpdate.setCarWashStation(carWashSession.getCarWashStation());
            sessionToUpdate.setCar(carWashSession.getCar());
            sessionToUpdate.setEstimatedWaitTime(carWashSession.getEstimatedWaitTime());
            sessionToUpdate.setEstimatedWashDuration(carWashSession.getEstimatedWashDuration());

            if ("Completed".equalsIgnoreCase(carWashSession.getStatus())) {
                sessionToUpdate.setStatus("Completed");
                sessionToUpdate.setActualWaitTime(carWashSession.getActualWaitTime());
                sessionToUpdate.setActualWashDuration(carWashSession.getActualWashDuration());
                sessionToUpdate.getCarWashStation().setCurrentCarsInWash( carWashSession.getCarWashStation().getCurrentCarsInWash()-1);
            }

            return carWashSessionRepository.save(sessionToUpdate);
        } else {
            throw new RuntimeException("Session not found");
        }
    }

    public void deleteCarWashSession(Long id) {
        carWashSessionRepository.deleteById(id);
    }
}
