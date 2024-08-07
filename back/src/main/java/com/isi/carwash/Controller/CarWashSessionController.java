package com.isi.carwash.Controller;

import com.isi.carwash.Entity.Car;
import com.isi.carwash.Entity.CarWashSession;
import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Entity.User;
import com.isi.carwash.Repository.CarRepository;
import com.isi.carwash.Repository.CarWashStationRepository;
import com.isi.carwash.Service.session.CarWashSessionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/carwash-sessions")
@CrossOrigin(origins = "*")
public class CarWashSessionController {

    @Autowired
    private CarWashSessionService carWashSessionService;
    @Autowired
    private CarWashStationRepository carWashStationRepository;
    @Autowired
    private CarRepository carRepository;

    @GetMapping
    public ResponseEntity<List<CarWashSession>> getAllCarWashSessions() {
        List<CarWashSession> carWashSessions = carWashSessionService.getAllCarWashSessions();
        return new ResponseEntity<>(carWashSessions, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarWashSession> getCarWashSessionById(@PathVariable Long id) {
        CarWashSession carWashSession = carWashSessionService.getCarWashSessionById(id);
        return new ResponseEntity<>(carWashSession, HttpStatus.OK);
    }
    @GetMapping("/{station_id}/cars")
    public ResponseEntity<List<Car>> getCarsForSessionsByStationId(@PathVariable Long station_id) {
        List<CarWashSession> sessions = carWashSessionService.getCarWashSessionByStationId(station_id);
        List<Car> cars = new ArrayList<>();
        for (CarWashSession session : sessions) {
            cars.add(session.getCar());
        }
        return new ResponseEntity<>(cars, HttpStatus.OK);
    }

    @GetMapping("/station/{stationId}")
    public ResponseEntity<List<CarWashSession>> getCarWashSessionsByStationId(@PathVariable Long stationId) {
        List<CarWashSession> carWashSessions = carWashSessionService.getCarWashSessionByStationId(stationId);
        return new ResponseEntity<>(carWashSessions, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CarWashSession>> getAllSessionsByUser(@PathVariable Long userId) {
        List<CarWashSession> sessions = carWashSessionService.getAllSessionsByUser(userId);
        return ResponseEntity.ok(sessions);
    }


    @PostMapping
    public ResponseEntity<CarWashSession> createCarWashSession(@RequestBody CarWashSession carWashSession) {
        System.out.println( carWashSession);
        Optional<CarWashStation> carWashStationOptional = carWashStationRepository.findById(carWashSession.getCarWashStation().getId());
        if (carWashStationOptional.isPresent()) {
            carWashSession.setCarWashStation(carWashStationOptional.get());
        } else {
            throw new EntityNotFoundException("probléme dans station");
        }
        Optional<Car> carOptional = carRepository.findById(carWashSession.getCar().getId());
        carOptional.ifPresent(carWashSession::setCar);
        if (carOptional.isPresent()) {
            carWashSession.setCar(carOptional.get());
        } else {
            throw new EntityNotFoundException("probléme dans voiture");
        }
        CarWashSession savedCarWashSession = carWashSessionService.createCarWashSession(carWashSession);
        return new ResponseEntity<>(savedCarWashSession, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<CarWashSession> updateCarWashSession(@PathVariable Long id, @RequestBody CarWashSession carWashSession) {
        Optional<CarWashStation> carWashStationOptional = carWashStationRepository.findById(carWashSession.getCarWashStation().getId());
        if (carWashStationOptional.isPresent()) {
            carWashSession.setCarWashStation(carWashStationOptional.get());
        } else {
            throw new EntityNotFoundException("probléme dans station");
        }
        Optional<Car> carOptional = carRepository.findById(carWashSession.getCar().getId());
        carOptional.ifPresent(carWashSession::setCar);
        if (carOptional.isPresent()) {
            carWashSession.setCar(carOptional.get());
        } else {
            throw new EntityNotFoundException("probléme dans voiture");
        }
        CarWashSession updatedCarWashSession = carWashSessionService.updateCarWashSession(id, carWashSession);
        return new ResponseEntity<>(updatedCarWashSession, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarWashSession(@PathVariable Long id) {
        carWashSessionService.deleteCarWashSession(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/availability")
    public ResponseEntity<List<Date>> getAvailableDatesByStationId(@RequestParam Long stationId) {
        List<Date> availableDates = carWashSessionService.getAvailableDatesByStationId(stationId);
        return ResponseEntity.ok(availableDates);
    }

    @GetMapping("/unavailability")
    public ResponseEntity<List<Date>> getUnAvailableDatesByStationId(@RequestParam Long stationId) {
        List<Date> unavailableDates = carWashSessionService.getUnavailableDatesByStationId(stationId);
        return ResponseEntity.ok(unavailableDates);
    }


    @GetMapping("/countSessions")
    public ResponseEntity<Long> countSessionsByStationAndDate(@RequestParam Long stationId,@RequestParam String washDate) {
        Date parsedDate = new Date(washDate);
        long sessionCount = carWashSessionService.countSessionsByStationAndDate(stationId, parsedDate,"In Progress");
        sessionCount+= carWashSessionService.countSessionsByStationAndDate(stationId, parsedDate,"Pending");
        return ResponseEntity.ok(sessionCount);
    }

    @GetMapping("/stations/{stationId}/current-week")
    public ResponseEntity<List<CarWashSession>> getSessionsForStationInCurrentWeek(@PathVariable Long stationId) {
        List<CarWashSession> sessions = carWashSessionService.getSessionsForStationInCurrentWeek(stationId);
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }
}
