package com.service.quickblog.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource; // Ensure this import is correct

import com.service.quickblog.Jwt.JwtAuthFilter;
import com.service.quickblog.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enable @PreAuthorize for method-level security
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter authFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsService; // Your custom UserDetailsService

    @Autowired
    private CorsConfigurationSource corsConfigurationSource; // Inject your CORS config bean

    // Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // User Details Service (Our custom implementation)
    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailsService; // Use the injected instance
    }

    // Authentication Provider (DAO based for our custom UserDetailsService)
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    // Authentication Manager (for programmatic authentication, e.g., login endpoint)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Security Filter Chain - Defines HTTP security rules
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Apply your CORS configuration
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no authentication required)
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/comment/get/{blogId}","/api/blog/get","/api/blog/get/{id}").permitAll()
                        // Allow CORS preflight requests (OPTIONS method)
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // Protected endpoints (require authentication)
                        .anyRequest().authenticated()
                )
                // Configure session management to be stateless (crucial for JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Set our custom authentication provider
                .authenticationProvider(authenticationProvider())
                // Add our JWT filter before Spring Security's default UsernamePasswordAuthenticationFilter
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
