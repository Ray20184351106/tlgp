package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String username;
    private String token;

    public LoginResponse(String username, String token) {
        this.username = username;
        this.token = token;
    }
}
