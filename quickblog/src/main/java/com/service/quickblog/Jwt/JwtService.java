package com.service.quickblog.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private long jwtExpiration; // Expiration time in milliseconds

    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        // You can add custom claims here if needed
        // claims.put("role", "USER"); // Example custom claim
        return createToken(claims, userName);
    }

    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .claims(claims) // Replaced setClaims()
                .subject(userName) // Replaced setSubject()
                .issuedAt(new Date(System.currentTimeMillis())) // Replaced setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Replaced setExpiration()
                .signWith(getSignKey())// This line is correct
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser() // This was already corrected to Jwts.parser()
                .setSigningKey(getSignKey())
                .build() // Build the parser
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
   
    public long getJwtExpiration() {
        return jwtExpiration;
    }

}