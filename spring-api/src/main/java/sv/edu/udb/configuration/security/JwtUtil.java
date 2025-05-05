package sv.edu.udb.configuration.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

@Component
public class JwtUtil {

    private final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    private String jwtSecret;
    private Integer jwtExpirationMs;
    private SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") final String jwtSecret,
                   @Value("${jwt.expiration}") final Integer jwtExpirationMs) {
        this.jwtSecret = Objects.requireNonNull(jwtSecret);
        this.jwtExpirationMs = Objects.requireNonNull(jwtExpirationMs);
    }

    // Initializes the key after the class is instantiated and the jwtSecret is injected,
    // preventing the repeated creation of the key and enhancing performance
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Generate JWT token
    public String generateToken(final String username) {
        return Jwts.builder()
                    .subject(username)
                    .issuedAt(new Date())
                    .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(key, Jwts.SIG.HS256)
                .compact();
    }


    // Get data from JWT token
    public Claims getAllClaimsFromToken(final String token) {
        return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                .getPayload();
    }

    // Validate JWT token
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
