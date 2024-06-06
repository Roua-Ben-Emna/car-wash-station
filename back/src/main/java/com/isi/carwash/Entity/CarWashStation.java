package com.isi.carwash.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data  // Includes getters, setters, equals, hashCode, toString
@Entity
@NoArgsConstructor  // Empty constructor
@AllArgsConstructor
public class CarWashStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double latitude;
    private double longitude;

    @Column(name = "max_capacity_cars")
    private int maxCapacityCars;

    @Column(name = "current_cars_in_wash")
    private int currentCarsInWash;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User manager;
    // Constructor, getters and setters
}