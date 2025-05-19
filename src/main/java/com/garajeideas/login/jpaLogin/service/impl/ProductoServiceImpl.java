package com.garajeideas.login.jpaLogin.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.garajeideas.login.jpaLogin.controller.response.ProductoResponse;
import com.garajeideas.login.jpaLogin.controller.request.ProductoRequest;
import com.garajeideas.login.jpaLogin.service.ProductoService;
import com.garajeideas.login.jpaLogin.repository.ProductoRepository;
import com.garajeideas.login.jpaLogin.service.mapper.ProductoMapper;
import com.garajeideas.login.jpaLogin.entity.Producto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    @NonNull
    private final ProductoRepository productoRepository;

    @NonNull
    private final ProductoMapper productoMapper;

    @Override
    public List<ProductoResponse> findAll() {
        return productoMapper.toProductoResponseList(productoRepository.findAll());
    }

    @Override
    public ProductoResponse findById(final Long id) {
        return productoMapper.toProductoResponse(
                productoRepository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException("Producto no encontrado con ID: " + id)));
    }

    @Override
    public ProductoResponse save(final ProductoRequest productoRequest) {
        final Producto producto = productoMapper.toProducto(productoRequest);
        return productoMapper.toProductoResponse(productoRepository.save(producto));
    }

    @Override
    public ProductoResponse update(final Long id, final ProductoRequest productoRequest) {
        final Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Producto no encontrado con ID: " + id));

        productoExistente.setNombre(productoRequest.getNombre());
        productoExistente.setImagen(productoRequest.getImagen());
        productoExistente.setDescripcion(productoRequest.getDescripcion());
        productoExistente.setIngredientes(productoRequest.getIngredientes());
        productoExistente.setBeneficios(productoRequest.getBeneficios());
        productoExistente.setPresentacion(
                Producto.Presentacion.valueOf(productoRequest.getPresentacion().toUpperCase())
        );
        productoExistente.setPrecio(productoRequest.getPrecio());

        productoRepository.save(productoExistente);
        return productoMapper.toProductoResponse(productoExistente);
    }

    @Override
    public void delete(final Long id) {
        if (!productoRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
}
