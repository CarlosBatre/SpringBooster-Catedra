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
    private String telefono;
    private String metodoPago;
    private String estado;
    private LocalDate fechaPedido;
    private Double total;
    private List<DetallePedidoDTO> detalles;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetallePedidoDTO {
        private Long productoId;
        private String nombreProducto;
        private int cantidad;
    }
}
