package com.isi.carwash.Repository;


import com.isi.carwash.Entity.User;
import com.isi.carwash.Entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    VerificationToken findByUser(User user);

}

