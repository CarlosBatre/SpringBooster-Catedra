package com.garajeideas.login.jpaLogin.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La imagen es obligatoria")
    private String imagen; // URL o ruta de la imagen

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotBlank(message = "Los ingredientes son obligatorios")
    private String ingredientes;

    @NotBlank(message = "Los beneficios son obligatorios")
    private String beneficios;

    @NotNull(message = "La presentación es obligatoria")
    private String presentacion; // Se validará luego contra los valores permitidos

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser un número positivo")
    private Double precio;
}
