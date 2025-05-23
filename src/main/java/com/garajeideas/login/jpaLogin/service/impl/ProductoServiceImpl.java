package com.garajeideas.login.jpaLogin.service.impl;

import com.garajeideas.login.jpaLogin.controller.request.ProductoRequest;
import com.garajeideas.login.jpaLogin.controller.response.ProductoResponse;
import com.garajeideas.login.jpaLogin.entity.Producto;
import com.garajeideas.login.jpaLogin.repository.ProductoRepository;
import com.garajeideas.login.jpaLogin.service.ProductoService;
import com.garajeideas.login.jpaLogin.service.assembler.ProductoAssembler;

import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    @NonNull
    private final ProductoRepository productoRepository;

    @NonNull
    private final ProductoAssembler productoAssembler;

    @NonNull
    private final PagedResourcesAssembler<Producto> pagedResourcesAssembler;

    @Override
    public PagedModel<ProductoResponse> findAll(final Pageable pageable) {
        return pagedResourcesAssembler.toModel(
                productoRepository.findAll(pageable),
                productoAssembler
        );
    }

    @Override
    public ProductoResponse findById(final Long id) {
        return productoAssembler.getProductoMapper()
                .toProductoResponse(
                        productoRepository.findById(id)
                                .orElseThrow(() ->
                                        new EntityNotFoundException("Producto no encontrado con ID: " + id))
                );
    }

    @Override
    public ProductoResponse save(final ProductoRequest productoRequest) {
        final Producto producto = productoAssembler.getProductoMapper()
                .toProducto(productoRequest);
        return productoAssembler.getProductoMapper()
                .toProductoResponse(productoRepository.save(producto));
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
        productoExistente.setExistencias(productoRequest.getExistencias());
        productoExistente.setPrecio(productoRequest.getPrecio());

        productoRepository.save(productoExistente);
        return productoAssembler.getProductoMapper()
                .toProductoResponse(productoExistente);
    }

    @Override
    public void delete(final Long id) {
        if (!productoRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
}
