package com.isi.carwash.Service.session;

import com.isi.carwash.Entity.CarWashSession;

import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Repository.CarWashSessionRepository;
import com.isi.carwash.enums.CarSize;
import com.isi.carwash.enums.WashType;
import com.isi.carwash.event.listener.RegistrationCompleteEventListener;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;


@Service
public class CarWashSessionService {

    @Autowired
    private CarWashSessionRepository carWashSessionRepository;
    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private RegistrationCompleteEventListener registrationCompleteEventListener;

    public long calculateEstimatedDuration(Long sessionId) {
        CarWashSession session = getCarWashSessionById(sessionId);
        long washDurationMillis = 0;
        CarWashStation carWashStation = session.getCarWashStation();
        if (session.getCar().getSize() != null && session.getWashType() != null) {
            if (session.getCar().getSize() == CarSize.MEDIUM) {
                if (session.getWashType() == WashType.INTERIOR) {
                    washDurationMillis = carWashStation.getEstimateCarMedium() + carWashStation.getEstimateTypeInterior();
                } else if (session.getWashType() == WashType.EXTERIOR) {
                    washDurationMillis = carWashStation.getEstimateCarMedium() + carWashStation.getEstimateTypeExterior();
                } else {
                    washDurationMillis = carWashStation.getEstimateCarMedium() + carWashStation.getEstimateTypeExteriorInterior();
                }
            } else if (session.getCar().getSize() == CarSize.LARGE) {
                if (session.getWashType() == WashType.INTERIOR) {
                    washDurationMillis = carWashStation.getEstimateCarLarge() + carWashStation.getEstimateTypeInterior();
                } else if (session.getWashType() == WashType.EXTERIOR) {
                    washDurationMillis = carWashStation.getEstimateCarLarge() + carWashStation.getEstimateTypeExterior();
                } else {
                    washDurationMillis = carWashStation.getEstimateCarLarge() + carWashStation.getEstimateTypeExteriorInterior();
                }
            } else if (session.getCar().getSize() == CarSize.SMALL) {
                if (session.getWashType() == WashType.INTERIOR) {
                    washDurationMillis = carWashStation.getEstimateCarSmall() + carWashStation.getEstimateTypeInterior();
                } else if (session.getWashType() == WashType.EXTERIOR) {
                    washDurationMillis = carWashStation.getEstimateCarSmall() + carWashStation.getEstimateTypeExterior();
                } else {
                    washDurationMillis = carWashStation.getEstimateCarSmall() + carWashStation.getEstimateTypeExteriorInterior();
                }
            }
        }
        return washDurationMillis;
    }





    public long calculateWaitTime(CarWashSession mySession) {
        long waitTimeMillis = 0;

        CarWashStation station = mySession.getCarWashStation();
        Long stationId = station.getId();

        List<CarWashSession> sessions = getInProgressSessionsByStationId(stationId);
        System.out.println("Total in-progress sessions for station " + stationId + ": " + sessions.size());

        int parallelSessionsCount = 0;
        for (CarWashSession session : sessions) {
            // Check overlap with the current session
            if (isSessionOverlap(session, mySession)) {
                parallelSessionsCount++;
            }
        }

        System.out.println("Parallel sessions count: " + parallelSessionsCount);
        System.out.println("Station parallel car washing capacity: " + station.getParallelCarWashing());

        if (parallelSessionsCount  >= station.getParallelCarWashing()) {
            for (CarWashSession session : sessions) {
                long maxWashDuration = 0;
                boolean sameStation = session.getCarWashStation().equals(mySession.getCarWashStation());
                boolean statusInProgress = session.getStatus().equals("In Progress");
                boolean overlap = isSessionOverlap(session, mySession);

                if (sameStation && statusInProgress && overlap) {
                    // Extract durations in milliseconds
                    long washDurationInMillis = session.getEstimatedWashDuration();
                    long waitTimeInMillis = session.getEstimatedWaitTime();
                    if (washDurationInMillis + waitTimeInMillis > maxWashDuration) {
                        maxWashDuration = washDurationInMillis + waitTimeInMillis; // Update the maximum wash duration if a longer one is found
                    }
                    // Calculate total wait time in milliseconds
                    waitTimeMillis += maxWashDuration;
                }
            }
        }

        System.out.println("Total wait time: " + (waitTimeMillis / (1000 * 60)) + " minutes");
        return waitTimeMillis;
    }

    private boolean isSessionOverlap(CarWashSession session, CarWashSession mySession) {
        Date sessionStartTime = session.getWashTime();

        LocalDateTime sessionStartDateTime = LocalDateTime.ofInstant(sessionStartTime.toInstant(), ZoneId.systemDefault());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        String formattedSessionStartTime = sessionStartDateTime.format(formatter);

        long washDurationMillis = session.getEstimatedWashDuration();
        long waitTimeMillis = session.getEstimatedWaitTime();
        long sessionEndMillis = sessionStartTime.getTime() + washDurationMillis + waitTimeMillis;

        LocalDateTime sessionEndTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(sessionEndMillis), ZoneId.systemDefault());

        String formattedSessionEndTime = sessionEndTime.format(formatter);

        LocalDateTime mySessionStartDateTime = LocalDateTime.ofInstant(mySession.getWashTime().toInstant(), ZoneId.systemDefault());

        String formattedMySessionStartTime = mySessionStartDateTime.format(formatter);

        System.out.println("Checking overlap for sessions:");
        System.out.println("Session start time: " + formattedSessionStartTime);
        System.out.println("Session end time: " + formattedSessionEndTime);
        System.out.println("My session start time: " + formattedMySessionStartTime);

        ZonedDateTime sessionEndZonedDateTime = sessionEndTime.atZone(ZoneId.systemDefault());
        Date sessionEndDate = Date.from(sessionEndZonedDateTime.toInstant());

        boolean overlap = mySessionStartDateTime.isAfter(sessionStartDateTime) && mySessionStartDateTime.isBefore(sessionEndTime);
        System.out.println("Overlap: " + overlap);

        return overlap;
    }




    public CarWashSession createCarWashSession(CarWashSession carWashSession) {
        carWashSession.setWashTime(new Date());
        carWashSessionRepository.save(carWashSession);
        carWashSession.setStatus("In Progress");
        carWashSession.setEstimatedWashDuration(calculateEstimatedDuration(carWashSession.getId()));
        carWashSession.setEstimatedWaitTime(calculateWaitTime(carWashSession));
        carWashSession.getCarWashStation().setCurrentCarsInWash( carWashSession.getCarWashStation().getCurrentCarsInWash()+1);
        CarWashSession savedSession = carWashSessionRepository.save(carWashSession);

        // Schedule reminder email
        scheduleReminderEmail(savedSession);

        return savedSession;
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
            sessionToUpdate.setWashType(carWashSession.getWashType());
            sessionToUpdate.setCarWashStation(carWashSession.getCarWashStation());
            sessionToUpdate.setCar(carWashSession.getCar());
            sessionToUpdate.setEstimatedWaitTime(carWashSession.getEstimatedWaitTime());
            sessionToUpdate.setEstimatedWashDuration(calculateEstimatedDuration(carWashSession.getId()));
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

    private void scheduleReminderEmail(CarWashSession session) {
        long estimatedDurationMillis = session.getEstimatedWashDuration();
        long waitTimeMillis = session.getEstimatedWaitTime();

        Date sessionStartTime = session.getWashTime();

        // Calculate session end time
        long sessionEndTimeMillis = sessionStartTime.getTime() + estimatedDurationMillis + waitTimeMillis;
        Date sessionEndTime = new Date(sessionEndTimeMillis);

        // Calculate reminder time (15 minutes before session end time)
        LocalDateTime sessionEndLocalDateTime = LocalDateTime.ofInstant(sessionEndTime.toInstant(), ZoneId.systemDefault());
        LocalDateTime reminderLocalDateTime = sessionEndLocalDateTime.minus(15, ChronoUnit.MINUTES);
        Instant reminderInstant = reminderLocalDateTime.atZone(ZoneId.systemDefault()).toInstant();
        Date reminderDate = Date.from(reminderInstant);

        // Print the calculated times for debugging
        System.out.println("Session end time: " + sessionEndLocalDateTime);
        System.out.println("Reminder time: " + reminderLocalDateTime);

        // Schedule the reminder email
        taskScheduler.schedule(() -> {
            try {
                registrationCompleteEventListener.sendSessionReminderEmail(session.getCar().getUser(), sessionEndLocalDateTime.toString());
            } catch (MessagingException | UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }, reminderDate);
    }


}




//    public Duration calculateEstimatedWaitTime(Long sessionId) {
//        CarWashSession session = getCarWashSessionById(sessionId);
//        CarWashStation station = session.getCarWashStation();
//        List<CarWashSession> sessionsInProgress = getInProgressSessionsByStationId(station.getId());
//        long totalWaitTimeMinutes = 0;
//
//        for (CarWashSession sessionInProgress : sessionsInProgress) {
//            Duration estimatedWashDuration = sessionInProgress.getEstimatedWashDuration();
//            totalWaitTimeMinutes += estimatedWashDuration.toMinutes();
//        }
//        return Duration.ofMinutes(totalWaitTimeMinutes);
//    }

//    public Duration calculateEstimatedWashDuration(Long sessionId, String washType, String carType) {
//        CarWashSession session = getCarWashSessionById(sessionId);
//
//        double baseDuration = 0;
//        if ("EXTERIOR".equalsIgnoreCase(washType)) {
//            baseDuration = session.getCarWashStation().getEstimateTypeExterior().toMinutes();
//        } else if ("INTERIOR".equalsIgnoreCase(washType)) {
//            baseDuration = session.getCarWashStation().getEstimateTypeInterior().toMinutes();
//        } else if ("EXTERIOR_INTERIOR".equalsIgnoreCase(washType)) {
//            baseDuration = session.getCarWashStation().getEstimateTypeExteriorInterior().toMinutes();
//        }
//
//        if ("SMALL".equalsIgnoreCase(carType)) {
//            baseDuration *= session.getCarWashStation().getEstimateCarSmall().toMinutes();
//        } else if ("MEDIUM".equalsIgnoreCase(carType)) {
//            baseDuration *= session.getCarWashStation().getEstimateCarMedium().toMinutes();
//        } else if ("LARGE".equalsIgnoreCase(carType)) {
//            baseDuration *= session.getCarWashStation().getEstimateCarLarge().toMinutes();
//        }
//
//        return Duration.ofMinutes((long) baseDuration);
//    }