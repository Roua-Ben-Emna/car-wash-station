package com.isi.carwash.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.isi.carwash.enums.WashType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
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

    @ManyToOne()
    @JoinColumn(name = "station_id")
    private CarWashStation carWashStation;

    @ManyToOne()
    @JoinColumn(name = "car_id")
    private Car car;


    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "wash_time")
    private Date washTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "wash_type")
    private WashType washType;

    @Column(name = "actual_wait_time")
    private long actualWaitTime;

    @Column(name = "actual_wash_duration")
    private long actualWashDuration;

    @Column(name = "estimated_wait_time")
    private long estimatedWaitTime;

    @Column(name = "estimated_wash_duration")
    private long estimatedWashDuration;

    @Column(name = "status")
    private String status;
    private boolean notified;
}
