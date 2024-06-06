package com.isi.carwash.Dto;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String email;

    private String newPassword;
}
