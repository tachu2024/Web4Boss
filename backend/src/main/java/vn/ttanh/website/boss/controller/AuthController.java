package vn.ttanh.website.boss.controller;

import vn.ttanh.website.boss.model.User;
import vn.ttanh.website.boss.repository.UserRepository;
import vn.ttanh.website.boss.security.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }
        log.info("Registering new user: " + user.getUsername() + " " + user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return Map.of("message", "User registered successfully");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        log.info("Logining user: " + user.getUsername() + " " + user.getPassword());
        User dbUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtils.generateJwtToken(dbUser.getUsername());
        
        // Tạo response chứa cả token và thông tin người dùng
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        
        // Tạo map chứa thông tin người dùng
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("fullname", dbUser.getFullname());
        userInfo.put("occupation", dbUser.getOccupation());
        userInfo.put("username", dbUser.getUsername());
        userInfo.put("hobby", dbUser.getHobby());
        
        response.put("user", userInfo);
        
        return response;
    }
}
