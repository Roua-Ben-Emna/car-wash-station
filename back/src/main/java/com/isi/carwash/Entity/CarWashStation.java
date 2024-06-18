package com.isi.carwash.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.util.HashSet;
import java.util.Set;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class CarWashStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double latitude;
    private double longitude;
    private String location;

    private Duration  EstimateTypeExterior;
    private Duration  EstimateTypeInterior;
    private Duration  EstimateTypeExteriorInterior;
    private Duration  EstimateCarSmall;
    private Duration  EstimateCarMedium;
    private Duration  EstimateCarLarge;

    @Column(name = "max_capacity_cars")
    private int maxCapacityCars;

    @Column(name = "current_cars_in_wash")
    private int currentCarsInWash;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User manager;

    @OneToMany(mappedBy = "carWashStation", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<CarWashSession> Sessions = new HashSet<>();
}