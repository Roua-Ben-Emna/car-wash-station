package com.isi.carwash.Controller;
import com.isi.carwash.Entity.CarWashStation;
import com.isi.carwash.Entity.User;
import com.isi.carwash.Repository.UserRepository;
import com.isi.carwash.Service.car.CarWashStationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/auth/carwash-stations")
@CrossOrigin(origins = "*")
public class CarWashStationController {

    @Autowired
    private CarWashStationService carWashStationService;
    @Autowired
    private UserRepository userRepository;
    @GetMapping
    public ResponseEntity<List<CarWashStation>> getAllCarWashStations() {
        List<CarWashStation> carWashStations = carWashStationService.getAllCarWashStations();
        return new ResponseEntity<>(carWashStations, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CarWashStation>> getAllCarWashStationsByManager(@PathVariable Long userId) {
        List<CarWashStation> cars = carWashStationService.getAllCarWashStationsByManager(userId);
        return new ResponseEntity<>(cars, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CarWashStation> getCarWashStationById(@PathVariable Long id) {
        CarWashStation carWashStation = carWashStationService.getCarWashStationById(id);
        return new ResponseEntity<>(carWashStation, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CarWashStation> createCarWashStation(@RequestBody CarWashStation carWashStation) {
        Optional<User> userOptional = userRepository.findById(carWashStation.getManager().getId());
        if (userOptional.isPresent()) {
            carWashStation.setManager(userOptional.get());
            CarWashStation savedCarWashStation = carWashStationService.createCarWashStation(carWashStation);
            return new ResponseEntity<>(savedCarWashStation, HttpStatus.CREATED);
        } else {
            throw new EntityNotFoundException("probléme");
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<CarWashStation> updateCarWashStation(@PathVariable Long id, @RequestBody CarWashStation carWashStation) {
        CarWashStation updatedCarWashStation = carWashStationService.updateCarWashStation(id, carWashStation);
        return new ResponseEntity<>(updatedCarWashStation, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarWashStation(@PathVariable Long id) {
        carWashStationService.deleteCarWashStation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CarWashStation>> searchCarWashStationsByName(@RequestParam String name) {
        List<CarWashStation> carWashStations = carWashStationService.searchCarWashStationsByName(name);
        return new ResponseEntity<>(carWashStations, HttpStatus.OK);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<CarWashStation>> getCarWashStationsByProximateLocation(@RequestParam double latitude, @RequestParam double longitude) {
        List<CarWashStation> carWashStations = carWashStationService.getCarWashStationsByProximateLocation(latitude, longitude);
        return new ResponseEntity<>(carWashStations, HttpStatus.OK);
    }
}
