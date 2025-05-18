package sv.edu.udb.controller.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoRequest {
    private String nombreCliente;
    private String direccion;
    private String telefono;
    private String metodoPago;
    private List<ProductoCantidad> productos;

    @Getter
    @Setter
    public static class ProductoCantidad {
        private Long productoId;
        private int cantidad;
    }
}
