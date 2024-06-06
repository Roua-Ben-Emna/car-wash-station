package com.isi.carwash.Entity;

import com.isi.carwash.enums.WashType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "car_wash_session")
public class CarWashSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "car_id")
    private Long carId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "wash_time")
    private Date washTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "wash_type")
    private WashType washType; // Use the WashType enum instead of String

    @Column(name = "actual_wait_time")
    private int actualWaitTime; // Real wait time

    @Column(name = "actual_wash_duration")
    private int actualWashDuration; // Real wash duration

    @Column(name = "estimated_wait_time")
    private int estimatedWaitTime; // Estimated wait time

    @Column(name = "estimated_wash_duration")
    private int estimatedWashDuration; // Estimated wash duration

    @Column(name = "status")
    private String status; // Status of the car wash session (e.g., in progress, completed, cancelled)
}
