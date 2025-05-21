package com.garajeideas.login.jpaLogin.service.assembler;

import com.garajeideas.login.jpaLogin.controller.ProductoController;
import com.garajeideas.login.jpaLogin.controller.response.ProductoResponse;
import com.garajeideas.login.jpaLogin.entity.Producto;
import com.garajeideas.login.jpaLogin.service.mapper.ProductoMapper;
import lombok.Getter;
import lombok.NonNull;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;
import java.util.Optional;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
@Component
public class ProductoAssembler extends RepresentationModelAssemblerSupport<Producto, ProductoResponse> {

    @Getter
    private final ProductoMapper productoMapper;

    public ProductoAssembler(@NonNull ProductoMapper productoMapper) {
        super(ProductoController.class, ProductoResponse.class);
        this.productoMapper = productoMapper;
    }

    @Override
    public ProductoResponse toModel(Producto producto) {
        return Optional.ofNullable(producto)
                .map(value -> {
                    ProductoResponse model = productoMapper.toProductoResponse(value);
                    model.add(linkTo(getControllerClass()).slash(model.getId()).withSelfRel());
                    return model;
                }).orElse(null);
    }
}
