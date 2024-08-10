package com.isi.carwash.Controller;

import com.isi.carwash.Dto.AuthenticationRequest;
import com.isi.carwash.Dto.PasswordResetRequest;
import com.isi.carwash.Dto.SignupDTO;
import com.isi.carwash.Entity.PasswordResetToken;
import com.isi.carwash.Entity.User;
import com.isi.carwash.Entity.VerificationToken;
import com.isi.carwash.Repository.PasswordResetTokenRepository;
import com.isi.carwash.Repository.UserRepository;
import com.isi.carwash.Repository.VerificationTokenRepository;
import com.isi.carwash.Service.user.ResetPassword.PasswordResetTokenService;
import com.isi.carwash.Service.user.UserService;
import com.isi.carwash.event.RegistrationCompleteEvent;
import com.isi.carwash.event.listener.RegistrationCompleteEventListener;
import com.isi.carwash.utils.Jwtutil;
import jakarta.mail.MessagingException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@EnableCaching
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    private final ApplicationEventPublisher publisher;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signupUser(@RequestBody SignupDTO signupDTO, final HttpServletRequest request) {
        if (userService.hasUserWithEmail(signupDTO.getEmail())) {
            return new ResponseEntity<>("User with this email already exist: " + signupDTO.getEmail(), HttpStatus.NOT_ACCEPTABLE);
        }
        User createdUser = userService.createUser(signupDTO);
        publisher.publishEvent(new RegistrationCompleteEvent(createdUser, applicationUrl(request)));
        if (createdUser == null) {
            return new ResponseEntity<>("User not created. Try again ! ", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    public String applicationUrl(HttpServletRequest request) {
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Jwtutil jwtutil;

    public static final String TOKEN_PREFIX = "Bearer ";

    public static final String HEADER_STRING = "Authorization ";

    @PostMapping("/authenticate")
    public void createAuthentificationToken(@RequestBody AuthenticationRequest authenticationRequest, HttpServletResponse response) throws BadCredentialsException, DisabledException, UsernameNotFoundException, IOException, JSONException, ServletException {
        User user = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        if (user == null || !user.isEnabled()) {
            throw new AuthenticationCredentialsNotFoundException("Your account is not activated. Please check your mailbox to verify your email and activate your account.");
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new AuthenticationCredentialsNotFoundException("Incorrect email or password");
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        final String jwt = jwtutil.generateToken(authenticationRequest.getEmail());
        response.getWriter().write(new JSONObject()
                .put("userId", user.getId())
                .put("role", user.getUserRole())
                .put("firstname", user.getFirstname())
                .put("lastname", user.getLastname())
                .put("email", user.getEmail())
                .put("telephone", user.getTelephone())
                .toString()
        );
        response.addHeader("Access-Control-Expose-Headers", "Authorization");
        response.addHeader("Access-Control-Allow-Headers", "Authorization,X-PINGGOTHER,Origin,X-Requested-With,Content-Type,Accept,X-Customheader");
        response.addHeader(HEADER_STRING, TOKEN_PREFIX + jwt);
    }

    @GetMapping("/getUsers")
    public List<User> getUsers() {
        return userService.getUsers();
    }
    private final VerificationTokenRepository tokenRepository;

    @GetMapping("/verifyEmail")
    public String verifyEmail(@RequestParam("token") String token ,HttpServletResponse response) throws IOException{
        VerificationToken theToken = tokenRepository.findByToken(token);
        if (theToken.getUser().isEnabled()) {
            return "This account has already been verified, please, login.";
        }
        String verificationResult = userService.validateToken(token);
        if (verificationResult.equalsIgnoreCase("valid")) {
            response.sendRedirect("http://localhost:4200/verification-email");
            return "Email verified successfully. Now you can login to your account";
        }
        return "Invalid verification token";
    }

    private final RegistrationCompleteEventListener eventListener;

   @PostMapping("/password-reset-request")
   public ResponseEntity<Map<String, String>> resetPasswordRequest(@RequestBody PasswordResetRequest passwordResetRequest,
                                                                   final HttpServletRequest servletRequest) throws MessagingException, UnsupportedEncodingException {
       Optional<User> user = userService.findByEmail(passwordResetRequest.getEmail());
       String passwordResetUrl = "";
       if (user.isPresent()) {
           String passwordResetToken = UUID.randomUUID().toString();
           userService.createPasswordResetTokenForUser(user.get(), passwordResetToken);
           passwordResetUrl = passwordResetEmailLink(user.get(), applicationUrl(servletRequest), passwordResetToken);
           Map<String, String> responseBody = new HashMap<>();
           responseBody.put("message", "Password reset request sent successfully. Please check your mailbox.");
           return ResponseEntity.ok(responseBody);
       } else {
           Map<String, String> responseBody = new HashMap<>();
           responseBody.put("error", "User not found. Please try again");
           return ResponseEntity.badRequest().body(responseBody);
       }
   }

    // front-end must run with port "4200" 
    private String passwordResetEmailLink(User user, String applicationUrl,
                                          String passwordToken) throws MessagingException, UnsupportedEncodingException {
        String url = "http://localhost:4200/set-new-password?token=" + passwordToken;
        eventListener.sendPasswordResetVerificationEmail(user,url);
        log.info("Click the link to reset your password :  {}", url);
        return url;
    }

    final private PasswordResetTokenService passwordResetTokenService;

    final private PasswordResetTokenRepository passwordResetTokenRepository;

    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@RequestBody PasswordResetRequest passwordResetRequest,
                                                @RequestParam("token") String token) {
        String tokenVerificationResult = userService.validatePasswordResetToken(token);
        if (!tokenVerificationResult.equalsIgnoreCase("valid")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token password reset token");
        }
        User theUser = userService.findUserByPasswordToken(token);
        if (theUser != null) {
            userService.changePassword(theUser, passwordResetRequest.getNewPassword());
            PasswordResetToken tok = passwordResetTokenService.findPasswordResetToken(token);
            passwordResetTokenRepository.delete(tok);
            return ResponseEntity.ok().body("{\"message\": \"Password has been reset successfully\"}");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password reset token");
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        User user = userService.getUserById(id);
        System.out.println("called find user from db");

        if(user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            System.out.println( "Your information has been successfully updated.");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Your information has been successfully updated.");
            return ResponseEntity.ok(response);
        } catch (ConfigDataResourceNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while updating the user.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }



    @PutMapping("/user/disable/{id}")
    public ResponseEntity<Map<String, String>> disableUserAccount(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", "L'utilisateur n'existe pas.");
            return ResponseEntity.notFound().build();
        }

        if (!user.isEnabled()) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", "Le compte de cet utilisateur est déjà désactivé.");
            return ResponseEntity.badRequest().body(responseBody);
        }

        try {
            userService.desactiverCompteuser(id);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Le compte de l'utilisateur a été désactivé avec succès.");
            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(responseBody);
        }
    }

    @PutMapping("/user/enable/{id}")
    public ResponseEntity<Map<String, String>> enableUserAccount(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", "L'utilisateur n'existe pas.");
            return ResponseEntity.notFound().build();
        }

        if (user.isEnabled()) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", "Le compte de cet utilisateur est déjà activé.");
            return ResponseEntity.badRequest().body(responseBody);
        }

        try {
            userService.enableUser(id);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Le compte de l'utilisateur a été activé avec succès.");
            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(responseBody);
        }
    }
    @DeleteMapping("/user/delete/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Utilisateur supprimé avec succès");
            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(responseBody);
        }
    }
}