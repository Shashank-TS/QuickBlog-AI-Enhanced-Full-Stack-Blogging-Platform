package com.service.quickblog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.service.quickblog.Jwt.JwtService;
import com.service.quickblog.dto.AuthRequest;
import com.service.quickblog.dto.AuthResponse;
import com.service.quickblog.model.User;
import com.service.quickblog.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User registrationRequest) {
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        // Encode the password before saving
        registrationRequest.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        
        // Assign a default role. For simplicity, let's assume all registered users are 'USER'.
        // You might want a more sophisticated role management system.
        if (registrationRequest.getRoles() == null || registrationRequest.getRoles().isEmpty()) {
            registrationRequest.setRoles("USER"); 
        }

        User savedUser = userRepository.save(registrationRequest);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(authRequest.getUsername());

                // Create an HTTP-only cookie
                ResponseCookie springCookie = ResponseCookie.from("jwtToken", token)
                        .httpOnly(true)       // Makes it inaccessible to JavaScript
                        .secure(true)         // Only send over HTTPS (RECOMMENDED for production)
                        .path("/")            // Available for all paths
                        .maxAge(jwtService.getJwtExpiration() / 1000) // Max age in seconds
                        .sameSite("Lax")      // CSRF protection (Strict, Lax, None)
                        .build();

                User user =userRepository.findByUsername(authRequest.getUsername()).orElseThrow(()->new RuntimeException("user not found"));
                AuthResponse authResponse=new AuthResponse();
                authResponse.setUserId(user.getId());

                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                        .body(authResponse); // Or a more generic success message
            } else {
                return new ResponseEntity<>("Authentication failed.", HttpStatus.UNAUTHORIZED);
            }
        } catch (AuthenticationException e) {
            return new ResponseEntity<>("Invalid username or password.", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred during authentication: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {

        ResponseCookie springCookie = ResponseCookie.from("jwtToken", "") // Empty value
                .httpOnly(true)
                .secure(true) // Should match your login cookie settings
                .path("/")
                .maxAge(0) // Set max-age to 0 to expire the cookie immediately
                .sameSite("Lax") // Should match your login cookie settings
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                .body("Logged out successfully!");
    }
}
