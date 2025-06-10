package com.service.quickblog.Jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie; // Import for Cookie
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.service.quickblog.service.UserDetailsServiceImpl;

import java.io.IOException;
import java.util.Arrays; // For Array stream operations

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        String username = null;

        // --- NEW LOGIC: Extract token from HTTP-only cookie ---
        if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                          .filter(cookie -> "jwtToken".equals(cookie.getName())) // Look for cookie named "jwtToken"
                          .map(Cookie::getValue)
                          .findFirst()
                          .orElse(null);
        }
        // --- END NEW LOGIC ---

        // Original logic for Authorization header (can keep as fallback or remove if only using cookies)
        // String authHeader = request.getHeader("Authorization");
        // if (authHeader != null && authHeader.startsWith("Bearer ")) {
        //     token = authHeader.substring(7);
        // }

        if (token != null) { // Proceed only if a token was found
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                // Log token parsing/validation errors for debugging
                logger.warn("JWT token extraction failed: " + e.getMessage());
                // Consider sending an appropriate error response or just letting it fall through
                // if token is invalid, SecurityContextHolder will remain null, leading to 401
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
            } catch (Exception e) {
                logger.warn("User details not found for username: " + username + ", " + e.getMessage());
                // Handle cases where username from token is not found in DB (e.g., user deleted)
            }


            if (userDetails != null && jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}