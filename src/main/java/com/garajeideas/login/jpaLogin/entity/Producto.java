package com.garajeideas.login.jpaLogin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 255)
    private String imagen; // Ruta o URL de la imagen

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 1000)
    private String ingredientes;

    @Column(length = 1000)
    private String beneficios;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Presentacion presentacion;

    @Column(nullable = false)
    private int existencias;

    @Column(nullable = false)
    private Double precio;

    // Enum para presentaciones válidas
    public enum Presentacion {
        CAPSULAS, FRASCO, TABLETAS, CREMA
    }
}
