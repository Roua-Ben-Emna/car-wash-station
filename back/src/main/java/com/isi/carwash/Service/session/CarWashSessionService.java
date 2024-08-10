package com.isi.carwash.Service.session;

import com.isi.carwash.Entity.CarWashSession;
import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Repository.CarWashSessionRepository;
import com.isi.carwash.Repository.CarWashStationRepository;
import com.isi.carwash.enums.CarSize;
import com.isi.carwash.enums.WashType;
import com.isi.carwash.event.listener.RegistrationCompleteEventListener;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Service
public class CarWashSessionService {

    @Autowired
    private CarWashSessionRepository carWashSessionRepository;

    @Autowired
    private CarWashStationRepository carWashStationRepository;
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

    public CarWashSession createCarWashSession(CarWashSession carWashSession) {
        carWashSession.setWashDate(carWashSession.getWashDate());
        carWashSessionRepository.save(carWashSession);
        carWashSession.setStatus("Pending");
        carWashSession.setEstimatedWashDuration(calculateEstimatedDuration(carWashSession.getId()));
        carWashSession.getCarWashStation().setCurrentCarsInWash( carWashSession.getCarWashStation().getCurrentCarsInWash()+1);
        carWashSession.setWashTime(setDynamicWashTime(carWashSession));
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

    public long countSessionsByStationAndDate(Long stationId, Date washDate, String status) {
        LocalDate localDate = washDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDateTime startOfDay = localDate.atStartOfDay();
        Date startOfDayDate = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
        return carWashSessionRepository.countByCarWashStationIdAndWashDateAndStatus(stationId, startOfDayDate, status);
    }

    public CarWashSession updateCarWashSession(Long id, CarWashSession carWashSession) {
        if (id == null) {
            throw new IllegalArgumentException("Session ID must not be null");
        }
        Optional<CarWashSession> existingSession = carWashSessionRepository.findById(id);
        if (existingSession.isPresent()) {
            CarWashSession sessionToUpdate = existingSession.get();
            sessionToUpdate.setWashType(carWashSession.getWashType());
            sessionToUpdate.setCarWashStation(carWashSession.getCarWashStation());
            sessionToUpdate.setCar(carWashSession.getCar());
            carWashSessionRepository.save(sessionToUpdate);
            System.out.println("before"+sessionToUpdate.getEstimatedWashDuration());
            sessionToUpdate.setEstimatedWashDuration(calculateEstimatedDuration(carWashSession.getId()));
            System.out.println("after"+sessionToUpdate.getEstimatedWashDuration());

            if ("In Progress".equalsIgnoreCase(carWashSession.getStatus())) {
                sessionToUpdate.setStatus("In Progress");
                sessionToUpdate.setWashTime(setDynamicWashTime(carWashSession));
                scheduleReminderEmail(sessionToUpdate);
            }
            if ("Completed".equalsIgnoreCase(carWashSession.getStatus())) {
                sessionToUpdate.setStatus("Completed");
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
        // Récupérer la date et l'heure de début de la session
        LocalDateTime sessionStartDateTime = LocalDateTime.ofInstant(session.getWashDate().toInstant(), ZoneId.systemDefault())
                .with(LocalTime.ofSecondOfDay(session.getWashTime() / 1000)); // Convertir les millisecondes en secondes pour LocalTime
        // Calculer l'heure de fin de la session
        LocalDateTime sessionEndDateTime = sessionStartDateTime
                .plus(Duration.ofMillis(estimatedDurationMillis))
                ;

        // Calculer l'heure de rappel (15 minutes avant la fin de la session)
        LocalDateTime reminderDateTime = sessionEndDateTime.minus(15, ChronoUnit.MINUTES);
        Instant reminderInstant = reminderDateTime.atZone(ZoneId.systemDefault()).toInstant();
        Date reminderDate = Date.from(reminderInstant);
        // Print the calculated times for debugging
        System.out.println("Session end time: " + sessionEndDateTime);
        System.out.println("Reminder time: " + reminderDateTime);

        // Schedule the reminder email
        taskScheduler.schedule(() -> {
            try {
                registrationCompleteEventListener.sendSessionReminderEmail(session.getCar().getUser(), sessionEndDateTime.toString());
            } catch (MessagingException | UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }, reminderDate);
    }

    public Long setDynamicWashTime(CarWashSession session) {
        CarWashStation station = session.getCarWashStation();
        Date washDate = session.getWashDate();
        List<CarWashSession> sessionsOfDay = carWashSessionRepository.findByCarWashStationAndWashDate(station, washDate);
        sessionsOfDay.removeIf(s -> s.getId().equals(session.getId()));

        long washTimeMillis;

        if (sessionsOfDay.isEmpty() || sessionsOfDay.size() < station.getParallelCarWashing()) {
            washTimeMillis = 28800000; // 8:00 AM en millisecondes
        } else {
            // Sinon, calculer 8h + la durée estimée des sessions précédentes le même jour
            long totalPreviousWashDurationMillis = calculateTotalPreviousWashDuration(sessionsOfDay,session.getCarWashStation().getParallelCarWashing());
            washTimeMillis = 28800000 + totalPreviousWashDurationMillis;
        }

        // Check if the wash date is today
        LocalDate today = LocalDate.now();
        LocalDate washLocalDate = washDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (washLocalDate.equals(today)) {
            // Get current time in milliseconds from midnight
            LocalTime now = LocalTime.now();
            long nowMillis = Duration.between(LocalTime.MIDNIGHT, now).toMillis();
            if (washTimeMillis < nowMillis) {
                washTimeMillis = nowMillis;
            }
        }

        // Ensure the wash time does not exceed the day's limit
        if (washTimeMillis >= 86400000) {
            throw new IllegalArgumentException("Wash time exceeds the limit of the day");
        }

        // Convert milliseconds to LocalTime and format
        Duration duration = Duration.ofMillis(washTimeMillis);
        LocalTime washTime = LocalTime.MIDNIGHT.plus(duration);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        String formattedTime = washTime.format(formatter);
        System.out.println("Wash time set: " + formattedTime);
        return washTimeMillis;
    }
    private long calculateTotalPreviousWashDuration(List<CarWashSession> sessions, int parallelCarWashing) {
        // Sort sessions by washTime
        sessions.sort(Comparator.comparingLong(CarWashSession::getWashTime));

        long totalDuration = 0;
        long currentWashTime = -1; // Initialize current wash time
        long maxDuration = 0;
        int currentParallelSessions = 0;

        for (CarWashSession session : sessions) {
            long washTime = session.getWashTime();
            long estimatedDuration = session.getEstimatedWashDuration();

            if (washTime == currentWashTime) {
                // If current session starts at the same washTime as previous, consider it parallel
                currentParallelSessions++;
                maxDuration = Math.max(maxDuration, estimatedDuration);
            } else {
                // New washTime encountered, process the previous batch of parallel sessions
                if (currentParallelSessions > 0) {
                    if (currentParallelSessions >= parallelCarWashing) {
                        totalDuration += maxDuration;
                    }
                }

                // Reset for the new batch of parallel sessions
                currentWashTime = washTime;
                currentParallelSessions = 1; // Start counting from this session
                maxDuration = estimatedDuration; // Initialize max duration for the new batch
            }
        }

        // Add duration of the last batch of parallel sessions
        if (currentParallelSessions > 0 && currentParallelSessions >= parallelCarWashing) {
            totalDuration += maxDuration;
        }

        return totalDuration;
    }
    public List<Date> getAvailableDatesByStationId(Long stationId) {
        List<Date> availableDates = new ArrayList<>();

        // Fetch station with maxCapacity
        Optional<CarWashStation> stationOptional = carWashStationRepository.findById(stationId);
        if (stationOptional.isPresent()) {
            CarWashStation station = stationOptional.get();
            int maxCapacity = station.getMaxCapacityCars();

            // Logic to determine available dates
            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(7); // You can adjust the end date as per your requirement

            System.out.println("Fetching available dates for stationId: " + stationId);
            System.out.println("Current date: " + today);
            System.out.println("End date: " + endDate);

            // Iterate through each date from today to endDate
            for (LocalDate date = today; date.isBefore(endDate); date = date.plusDays(1)) {
                // Convert LocalDate to Date
                // Convert LocalDate to Date without considering time and timezone
                LocalTime time = LocalTime.of(0, 0);
                LocalDateTime dateTime = LocalDateTime.of(date, time);
                // Convert LocalDateTime to Date
                Date washDate = Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());

                // Count sessions in progress for the current date
                long countInProgressSessions = carWashSessionRepository.countByCarWashStationIdAndWashDateAndStatus(stationId, washDate, "In Progress");
                countInProgressSessions+= carWashSessionRepository.countByCarWashStationIdAndWashDateAndStatus(stationId, washDate, "Pending");
                // Check if the current date has available capacity
                if (countInProgressSessions < maxCapacity) {
                    availableDates.add(washDate);
                    System.out.println("Added available date: " + washDate);
                }else {
                    System.out.println("Date " + washDate + " exceeds capacity. Current count: " + countInProgressSessions + ", Max capacity: " + maxCapacity);
                }
            }
            System.out.println("Available dates found: " + availableDates.size());

        } else {
            throw new EntityNotFoundException("Car Wash Station not found with id: " + stationId);
        }

        return availableDates;
    }


    public List<Date> getUnavailableDatesByStationId(Long stationId) {
        List<Date> unavailableDates = new ArrayList<>();
        // Fetch station with maxCapacity
        Optional<CarWashStation> stationOptional = carWashStationRepository.findById(stationId);
        if (stationOptional.isPresent()) {
            CarWashStation station = stationOptional.get();
            int maxCapacity = station.getMaxCapacityCars();
            List<String> statuses = Arrays.asList("In Progress", "Pending");
            // Fetch sessions in progress for the station
            List<CarWashSession> sessionsInProgress = carWashSessionRepository.findSessionsInProgressOrPending(stationId, statuses);

            // Iterate through each session to find unavailable dates
            for (CarWashSession session : sessionsInProgress) {
                Date sessionDate = session.getWashDate();

                // Count sessions on the same date
                long countSessionsOnDate = sessionsInProgress.stream()
                        .filter(s -> isSameDate(s.getWashDate(), sessionDate))
                        .count();

                // Check if sessions on the date exceed capacity
                if (countSessionsOnDate >= maxCapacity && !unavailableDates.contains(sessionDate)) {
                    unavailableDates.add(sessionDate);
                }
            }

            System.out.println("Unavailable dates found: " + unavailableDates.size());
        } else {
            throw new EntityNotFoundException("Car Wash Station not found with id: " + stationId);
        }

        return unavailableDates;
    }
    private boolean isSameDate(Date date1, Date date2) {
        LocalDate localDate1 = date1.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate localDate2 = date2.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return localDate1.isEqual(localDate2);
    }


    public List<CarWashSession> getSessionsForStationInCurrentWeek(Long stationId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);
        Date startDate = Date.from(startOfWeek.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endOfWeek.atStartOfDay(ZoneId.systemDefault()).toInstant());
        CarWashStation station = new CarWashStation();
        station.setId(stationId);
        return carWashSessionRepository.findByCarWashStationAndWashDateBetween(station, startDate, endDate);
    }
}



