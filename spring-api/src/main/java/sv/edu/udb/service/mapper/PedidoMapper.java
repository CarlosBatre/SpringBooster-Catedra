package sv.edu.udb.service.mapper;

import org.springframework.stereotype.Component;
import sv.edu.udb.controller.response.PedidoResponse;
import sv.edu.udb.repository.domain.DetallePedido;
import sv.edu.udb.repository.domain.Pedido;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PedidoMapper {

    public PedidoResponse toResponse(Pedido pedido) {
        return PedidoResponse.builder()
                .id(pedido.getId())
                .nombreCliente(pedido.getNombreCliente())
                .direccion(pedido.getDireccion())
                .telefono(pedido.getTelefono())
                .metodoPago(pedido.getMetodoPago())
                .estado(pedido.getEstado())
                .fechaPedido(pedido.getFechaPedido())
                .total(pedido.getTotal())
                .detalles(toDetalleDTOList(pedido.getDetalles()))
                .build();
    }

    private List<PedidoResponse.DetallePedidoDTO> toDetalleDTOList(List<DetallePedido> detalles) {
        return detalles.stream().map(detalle -> {
            PedidoResponse.DetallePedidoDTO dto = new PedidoResponse.DetallePedidoDTO();
            dto.setProductoId(detalle.getProducto().getId());
            dto.setNombreProducto(detalle.getProducto().getNombre());
            dto.setCantidad(detalle.getCantidad());
            return dto;
        }).collect(Collectors.toList());
    }
}
