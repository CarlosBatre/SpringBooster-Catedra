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
    @Override
    public PedidoResponse actualizarPedido(Long id, PedidoRequest request) {
        Pedido pedidoExistente = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + id));

        // Limpiar detalles antiguos
        pedidoExistente.getDetalles().clear();
        double total = 0;
        List<DetallePedido> nuevosDetalles = new ArrayList<>();

        for (PedidoRequest.ProductoPedido item : request.getProductos()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + item.getProductoId()));

            int cantidad = item.getCantidad();
            if (producto.getExistencias() < cantidad) {
                throw new IllegalArgumentException("No hay existencias suficientes para el producto: " + producto.getNombre());
            }

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedidoExistente)
                    .producto(producto)
                    .cantidad(cantidad)
                    .imagen(producto.getImagen())
                    .precioUnitario(producto.getPrecio())
                    .build();

            nuevosDetalles.add(detalle);
            total += producto.getPrecio() * cantidad;
        }

        // Actualizar campos
        pedidoExistente.setNombreCliente(request.getNombreCliente());
        pedidoExistente.setDireccion(request.getDireccion());
        pedidoExistente.setEmail(request.getEmail());
        pedidoExistente.setTelefono(request.getTelefono());
        pedidoExistente.setMetodoPago(request.getMetodoPago());
        pedidoExistente.setDetalles(nuevosDetalles);
        pedidoExistente.setTotal(total);

        // Guardar cambios
        Pedido actualizado = pedidoRepository.save(pedidoExistente);
        productoRepository.saveAll(nuevosDetalles.stream().map(DetallePedido::getProducto).toList());

        // Retornar usando el assembler
        return pedidoAssembler.toModel(actualizado);
    }

    @Override
    public void eliminarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + id));
        pedidoRepository.delete(pedido);
    }
    @Override
    @Transactional
    public PedidoResponse actualizarEstado(Long id, String estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + id));

        pedido.setEstado(estado);
        Pedido actualizado = pedidoRepository.save(pedido);
        return pedidoAssembler.toModel(actualizado);
    }

}
