package sv.edu.udb.service;

import sv.edu.udb.controller.request.ProductoRequest;
import sv.edu.udb.controller.response.ProductoResponse;

import java.util.List;

public interface ProductoService {
    List<ProductoResponse> findAll();
    ProductoResponse findById(final Long id);
    ProductoResponse save(final ProductoRequest productoRequest);
    ProductoResponse update(final Long id, final ProductoRequest productoRequest);
    void delete(final Long id);
}
