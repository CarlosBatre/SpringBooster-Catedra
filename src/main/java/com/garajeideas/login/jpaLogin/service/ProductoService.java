package com.garajeideas.login.jpaLogin.service;

import com.garajeideas.login.jpaLogin.controller.response.ProductoResponse;
import com.garajeideas.login.jpaLogin.controller.request.ProductoRequest;
import java.util.List;

public interface ProductoService {
    List<ProductoResponse> findAll();
    ProductoResponse findById(final Long id);
    ProductoResponse save(final ProductoRequest productoRequest);
    ProductoResponse update(final Long id, final ProductoRequest productoRequest);
    void delete(final Long id);
}
