package com.isi.carwash.event.listener;


import com.isi.carwash.Entity.User;
import com.isi.carwash.Service.user.UserService;
import com.isi.carwash.event.RegistrationCompleteEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {
    private final UserService userService;
    private User theUser;
    private final JavaMailSender mailSender;

    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        theUser = event.getUser();
        String verificationToken = UUID.randomUUID().toString();
        userService.saveUserVerificationToken(theUser, verificationToken);
        String url = event.getApplicationUrl()+"/api/auth/verifyEmail?token="+verificationToken;
        try {
            sendVerificationEmail(url);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        log.info("Click the link to verify your registration : {}",url);
    }

    public void sendVerificationEmail(String url) throws MessagingException, UnsupportedEncodingException {
        String subject = "Verify Your Email Address";
        String senderName = "Car Wash Service";
        String mailContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;\">" +
                "<div style=\"text-align: center; padding-bottom: 20px;\">" +
                "<h1 style=\"color: #333;\">Welcome to Car Wash Service!</h1>" +
                "<img src=\"https://example.com/logo.png\" alt=\"Car Wash Service Logo\" style=\"width: 100px; height: auto;\">" +
                "</div>" +
                "<p style=\"color: #555;\">Hi " + theUser.getFirstname() + " " + theUser.getLastname() + ",</p>" +
                "<p style=\"color: #555;\">Thank you for registering with Car Wash Service.</p>" +
                "<p style=\"color: #555;\">Please click the link below to verify your email address and activate your account:</p>" +
                "<div style=\"text-align: center; margin: 20px 0;\">" +
                "<a href=\"" + url + "\" style=\"background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">Verify Your Email</a>" +
                "</div>" +
                "<p style=\"color: #555;\">Thank you,<br>The Car Wash Service Team</p>" +
                "<hr style=\"border-top: 1px solid #eee;\">" +
                "<p style=\"color: #999; font-size: 12px; text-align: center;\">If you have any questions, feel free to contact us at <a href=\"mailto:support@carwashservice.com\">support@carwashservice.com</a>.</p>" +
                "</div>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom("rouabenemna@gmail.com", senderName);
        messageHelper.setTo(theUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }


    public void sendPasswordResetVerificationEmail(User theUser, String url) throws MessagingException, UnsupportedEncodingException {
        String subject = "Password Reset Request";
        String senderName = "Car Wash Service";
        String mailContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;\">" +
                "<div style=\"text-align: center; padding-bottom: 20px;\">" +
                "<h1 style=\"color: #333;\">Password Reset Request</h1>" +
                "<img src=\"https://example.com/logo.png\" alt=\"Car Wash Service Logo\" style=\"width: 100px; height: auto;\">" +
                "</div>" +
                "<p style=\"color: #555;\">Hi " + theUser.getFirstname() + " " + theUser.getLastname() + ",</p>" +
                "<p style=\"color: #555;\">We received a request to reset your password for your Car Wash Service account.</p>" +
                "<p style=\"color: #555;\">Please click the link below to reset your password:</p>" +
                "<div style=\"text-align: center; margin: 20px 0;\">" +
                "<a href=\"" + url + "\" style=\"background-color: #FF5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">Reset Your Password</a>" +
                "</div>" +
                "<p style=\"color: #555;\">If you did not request a password reset, please ignore this email or contact support if you have any questions.</p>" +
                "<p style=\"color: #555;\">Thank you,<br>The Car Wash Service Team</p>" +
                "<hr style=\"border-top: 1px solid #eee;\">" +
                "<p style=\"color: #999; font-size: 12px; text-align: center;\">If you have any questions, feel free to contact us at <a href=\"mailto:support@carwashservice.com\">support@carwashservice.com</a>.</p>" +
                "</div>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom("rouabenemna@gmail.com", senderName);
        messageHelper.setTo(theUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }


    public void sendSessionReminderEmail(User user, String sessionEndTime) throws MessagingException, UnsupportedEncodingException {
        String subject = "Car Wash Session Reminder";
        String senderName = "Car Wash Service";
        String mailContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;\">" +
                "<div style=\"text-align: center; padding-bottom: 20px;\">" +
                "<h1 style=\"color: #333;\">Car Wash Session Reminder</h1>" +
                "<img src=\"https://example.com/logo.png\" alt=\"Car Wash Service Logo\" style=\"width: 100px; height: auto;\">" +
                "</div>" +
                "<p style=\"color: #555;\">Hi " + user.getFirstname() + " " + user.getLastname() + ",</p>" +
                "<p style=\"color: #555;\">This is a reminder that your car wash session will end at " + sessionEndTime + ".</p>" +
                "<p style=\"color: #555;\">Please ensure that you are available to collect your car on time.</p>" +
                "<p style=\"color: #555;\">Thank you,<br>The Car Wash Service Team</p>" +
                "<hr style=\"border-top: 1px solid #eee;\">" +
                "<p style=\"color: #999; font-size: 12px; text-align: center;\">If you have any questions, feel free to contact us at <a href=\"mailto:support@carwashservice.com\">support@carwashservice.com</a>.</p>" +
                "</div>";

        sendEmail(user, subject, mailContent, senderName);
    }


    public void sendEmail(User user, String subject, String mailContent, String senderName) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom("rouabenemna@gmail.com", senderName);
        messageHelper.setTo(user.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }

}
