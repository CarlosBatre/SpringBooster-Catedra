package com.garajeideas.login.jpaLogin.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Service;
import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.repository.ProductoRepository;
import com.garajeideas.login.jpaLogin.entity.DetallePedido;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.entity.Producto;
import com.garajeideas.login.jpaLogin.repository.PedidoRepository;
import com.garajeideas.login.jpaLogin.service.PedidoService;
import com.garajeideas.login.jpaLogin.service.assembler.PedidoAssembler;
import com.garajeideas.login.jpaLogin.service.mapper.PedidoMapper;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;

    private final ProductoRepository productoRepository;

    private final PedidoMapper pedidoMapper;

    private final PedidoAssembler pedidoAssembler;

    private final PagedResourcesAssembler<Pedido> pagedResourcesAssembler;

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

    @Override
    public PagedModel<PedidoResponse> listarPedidos(Pageable pageable) {
        return pagedResourcesAssembler.toModel(
                pedidoRepository.findAll(pageable),
                pedidoAssembler
        );
    }

    @Override
    public PedidoResponse obtenerPedidoPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + id));
        return pedidoMapper.toResponse(pedido);
    }
}
