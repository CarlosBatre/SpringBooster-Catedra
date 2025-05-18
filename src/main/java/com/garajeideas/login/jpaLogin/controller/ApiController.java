package com.garajeideas.login.jpaLogin.controller;

import com.garajeideas.login.jpaLogin.entity.Empleados;
import com.garajeideas.login.jpaLogin.entity.User;
import com.garajeideas.login.jpaLogin.repository.EmpleadosRepository;
import com.garajeideas.login.jpaLogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {

    private final UserRepository userRepository;
    private final EmpleadosRepository empleadosRepository;
    private final PasswordEncoder passwordEncoder;

    // Endpoints para Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok((List<User>) userRepository.findAll());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // Verificar si el usuario ya existe
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("El usuario ya existe");
        }

        // Encriptar la contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Asignar rol por defecto si no se especifica
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        User savedUser = userRepository.save(user);
        // No devolver la contraseña en la respuesta
        savedUser.setPassword(null);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Endpoints para Empleados
    @GetMapping("/empleados")
    public ResponseEntity<List<Empleados>> getAllEmpleados() {
        return ResponseEntity.ok((List<Empleados>) empleadosRepository.findAll());
    }

    @GetMapping("/empleados/{id}")
    public ResponseEntity<Empleados> getEmpleadoById(@PathVariable Long id) {
        return empleadosRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/empleados")
    public ResponseEntity<Empleados> createEmpleado(@RequestBody Empleados empleado) {
        return ResponseEntity.ok(empleadosRepository.save(empleado));
    }

    @PutMapping("/empleados/{id}")
    public ResponseEntity<Empleados> updateEmpleado(@PathVariable Long id, @RequestBody Empleados empleado) {
        if (!empleadosRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        empleado.setId(id);
        return ResponseEntity.ok(empleadosRepository.save(empleado));
    }

    @DeleteMapping("/empleados/{id}")
    public ResponseEntity<Void> deleteEmpleado(@PathVariable Long id) {
        if (!empleadosRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        empleadosRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}