package com.isi.carwash.Service.user;



import com.isi.carwash.Dto.SignupDTO;
import com.isi.carwash.Entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getUsers();

    User createUser(SignupDTO signupDTO);

    boolean hasUserWithEmail(String email);

    void saveUserVerificationToken(User theUser, String verificationToken);

    String validateToken(String token);

    Optional<User> findByEmail(String email);

    void changePassword(User theUser, String newPassword);

    String validatePasswordResetToken(String token);

    User findUserByPasswordToken(String token);

    void createPasswordResetTokenForUser(User user, String passwordResetToken);

    User updateUser(Long id, User user);

    User desactiverCompteuser(Long id);

    User getUserById(Long id);
    void deleteUser(Long userId);
    void updateLocation(Long id,double latitude, double longitude);

    }