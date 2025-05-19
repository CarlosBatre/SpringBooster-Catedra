package com.garajeideas.login.jpaLogin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.garajeideas.login.jpaLogin.controller.request.ProductoRequest;
import com.garajeideas.login.jpaLogin.controller.response.ProductoResponse;
import com.garajeideas.login.jpaLogin.service.ProductoService;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping(path = "productos")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<ProductoResponse> findAllProductos() {
        return productoService.findAll();
    }

    @GetMapping(path = "{id}")
    public ProductoResponse findProductoById(@PathVariable(name = "id") final Long id) {
        return productoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(CREATED)
    public ProductoResponse saveProducto(@Valid @RequestBody final ProductoRequest request) {
        return productoService.save(request);
    }

    @PutMapping(path = "{id}")
    public ProductoResponse updateProducto(@PathVariable(name = "id") final Long id,
                                           @Valid @RequestBody final ProductoRequest request) {
        return productoService.update(id, request);
    }

    @DeleteMapping(path = "{id}")
    @ResponseStatus(NO_CONTENT)
    public void deleteProducto(@PathVariable(name = "id") final Long id) {
        productoService.delete(id);
    }
}
