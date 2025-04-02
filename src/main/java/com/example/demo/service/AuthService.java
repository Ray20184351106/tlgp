package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.dto.LoginResponse;
import com.example.demo.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // 注册
    @Autowired
    private PasswordEncoderUtil passwordEncoder;

    public String register(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            return "Username exists";
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password)); // 加密存储
        userRepository.save(newUser);
        return "Registration success";
    }

    // 登录
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public ResponseEntity<?> login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
//        // 生成双令牌
//        String accessToken = jwtTokenProvider.createToken(username);
//        String refreshToken = jwtTokenProvider.createRefreshToken(username);


        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtTokenProvider.createToken(username);
        return ResponseEntity.ok(new LoginResponse(username, token));
    }
}
