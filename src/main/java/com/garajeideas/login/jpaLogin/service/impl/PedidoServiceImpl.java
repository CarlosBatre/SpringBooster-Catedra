package com.garajeideas.login.jpaLogin.service.impl;

import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.entity.DetallePedido;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.entity.Producto;
import com.garajeideas.login.jpaLogin.repository.PedidoRepository;
import com.garajeideas.login.jpaLogin.repository.ProductoRepository;
import com.garajeideas.login.jpaLogin.service.PedidoService;
import com.garajeideas.login.jpaLogin.service.assembler.PedidoAssembler;
import com.garajeideas.login.jpaLogin.service.mapper.PedidoMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public PedidoResponse realizarPedido(PedidoRequest request) {
        Pedido pedido = pedidoMapper.toPedido(request);
        pedido.setEstado("Pedido Realizado");
        pedido.setFechaPedido(LocalDate.now());

        List<DetallePedido> detalles = new ArrayList<>();
        double total = 0;

        for (PedidoRequest.ProductoPedido item : request.getProductos()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + item.getProductoId()));

            int cantidadSolicitada = item.getCantidad();
            if (producto.getExistencias() < cantidadSolicitada) {
                throw new IllegalArgumentException("No hay existencias suficientes para el producto: " + producto.getNombre());
            }

            producto.setExistencias(producto.getExistencias() - cantidadSolicitada);

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedido)
                    .producto(producto)
                    .cantidad(cantidadSolicitada)
                    .imagen(producto.getImagen())
                    .precioUnitario(producto.getPrecio())
                    .build();

            detalles.add(detalle);
            total += producto.getPrecio() * cantidadSolicitada;
        }

        pedido.setDetalles(detalles);
        pedido.setTotal(total);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        productoRepository.saveAll(
                detalles.stream()
                        .map(DetallePedido::getProducto)
                        .toList()
        );

        return pedidoAssembler.toModel(pedidoGuardado);
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
        return pedidoAssembler.toModel(pedido);
    }
}
