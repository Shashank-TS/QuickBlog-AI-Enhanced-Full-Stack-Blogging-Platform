package com.service.quickblog.Jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie; 
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
import java.util.Arrays; 

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

        if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                          .filter(cookie -> "jwtToken".equals(cookie.getName())) 
                          .map(Cookie::getValue)
                          .findFirst()
                          .orElse(null);
        }

        if (token != null) { 
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                
                logger.warn("JWT token extraction failed: " + e.getMessage());
                
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            try {
                userDetails = userDetailsService.loadUserByUsername(username);
            } catch (Exception e) {
                logger.warn("User details not found for username: " + username + ", " + e.getMessage());
                
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