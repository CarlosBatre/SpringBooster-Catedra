package com.garajeideas.login.jpaLogin.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {

    private Long id;
    private String nombre;
    private String imagen;
    private String descripcion;
    private String ingredientes;
    private String beneficios;
    private String presentacion;
    private Double precio;
}
