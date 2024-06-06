package com.isi.carwash.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.isi.carwash.enums.CarSize;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private int year;
    @Enumerated(EnumType.STRING)
    private CarSize size; // Ajouter cet attribut pour représenter la taille de la voiture
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "carId", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CarWashSession> washSessions;

}
