package com.garajeideas.login.jpaLogin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empleados")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Empleados {

    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String password;
    private Boolean despedidos;
    private String email;
    private String nombre;
}

