package com.garajeideas.login.jpaLogin.service.mapper;

import org.mapstruct.Mapper;
import com.garajeideas.login.jpaLogin.controller.response.ProductoResponse;
import com.garajeideas.login.jpaLogin.controller.request.ProductoRequest;
import com.garajeideas.login.jpaLogin.entity.Producto;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductoMapper {
    ProductoResponse toProductoResponse(final Producto data);
    List<ProductoResponse> toProductoResponseList(final List<Producto> productoList);
    Producto toProducto(final ProductoRequest productoRequest);
}
