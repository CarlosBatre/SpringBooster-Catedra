package sv.edu.udb.controller.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponse {
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
