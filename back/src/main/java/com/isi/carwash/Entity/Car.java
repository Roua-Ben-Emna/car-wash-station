package com.isi.carwash.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.isi.carwash.enums.CarSize;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data  // Includes getters, setters, equals, hashCode, toString
@Entity
@NoArgsConstructor  // Empty constructor
@AllArgsConstructor
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String make;
    private String model;
    private String registrationNumber;
    @Enumerated(EnumType.STRING)
    private CarSize size;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<CarWashSession> Sessions = new HashSet<>();

}
