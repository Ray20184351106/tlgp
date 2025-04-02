package com.example.demo.controller;

import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 注册接口
    @PostMapping("/register")
    public String register(
            @RequestParam("username") String username,  // 明确指定参数名
            @RequestParam("password") String password
    ) {
        return authService.register(username, password);
    }

    // 登录接口
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username,
                                   @RequestParam String password) {
        return authService.login(username, password);
    }
}