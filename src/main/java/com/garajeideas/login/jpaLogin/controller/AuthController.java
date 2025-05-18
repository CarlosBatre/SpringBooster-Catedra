package com.garajeideas.login.jpaLogin.controller;

import com.garajeideas.login.jpaLogin.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Intentar autenticar al usuario
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Generar token JWT
            String token = jwtService.generateToken(
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal()
            );

            // Crear respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", request.getUsername());
            response.put("message", "Login exitoso");
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Credenciales inválidas");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error en el servidor");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }    }
}
