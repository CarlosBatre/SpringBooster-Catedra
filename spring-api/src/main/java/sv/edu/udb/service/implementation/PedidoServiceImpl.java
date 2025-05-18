package sv.edu.udb.service.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.edu.udb.controller.request.PedidoRequest;
import sv.edu.udb.repository.ProductoRepository;
import sv.edu.udb.repository.domain.DetallePedido;
import sv.edu.udb.repository.domain.Pedido;
import sv.edu.udb.repository.domain.Producto;
import sv.edu.udb.repository.PedidoRepository;
import sv.edu.udb.service.PedidoService;
import sv.edu.udb.service.mapper.PedidoMapper;
import sv.edu.udb.controller.response.PedidoResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final PedidoMapper pedidoMapper;

    @Override
    public PedidoResponse realizarPedido(PedidoRequest request) {
        List<DetallePedido> detalles = new ArrayList<>();
        double total = 0;

        Pedido pedido = Pedido.builder()
                .nombreCliente(request.getNombreCliente())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .metodoPago(request.getMetodoPago())
                .estado("Pedido Realizado")
                .fechaPedido(LocalDate.now())
                .build();

        for (PedidoRequest.ProductoCantidad item : request.getProductos()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + item.getProductoId()));

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedido)
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .build();

            detalles.add(detalle);
            total += producto.getPrecio() * item.getCantidad();
        }

        pedido.setDetalles(detalles);
        pedido.setTotal(total);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        return pedidoMapper.toResponse(pedidoGuardado);
    }
}
