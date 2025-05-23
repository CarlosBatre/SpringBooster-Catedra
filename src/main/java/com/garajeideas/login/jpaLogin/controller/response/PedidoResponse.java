package com.garajeideas.login.jpaLogin.controller.response;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponse extends RepresentationModel<PedidoResponse> {

    private Long id;
    private String nombreCliente;
    private String direccion;
    private String email;
    private String telefono;
    private String metodoPago;
    private String estado;
    private LocalDate fechaPedido;
    private Double total;

    private List<DetallePedidoResponse> detalles;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetallePedidoResponse {

        private Long id;
        private Long productoId;
        private String nombreProducto;
        private String imagen;
        private int cantidad;
        private double precioUnitario;
    }
}
