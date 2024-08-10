package com.isi.carwash.Entity;

import com.isi.carwash.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.NaturalId;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname;
    @NaturalId(mutable = true)
    private String email;
    private String telephone;
    private String password;
    private UserRole userRole;
    private boolean isEnabled = false;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private VerificationToken verificationToken;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private PasswordResetToken passwordResetToken;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Car> cars = new HashSet<>();

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    private Set<CarWashStation> managedStations = new HashSet<>();

}
