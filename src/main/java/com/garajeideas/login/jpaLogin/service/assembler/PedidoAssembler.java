package com.garajeideas.login.jpaLogin.service.assembler;

import com.garajeideas.login.jpaLogin.controller.PedidoController;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.service.mapper.PedidoMapper;

import lombok.Getter;
import lombok.NonNull;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

@Component
public class PedidoAssembler extends RepresentationModelAssemblerSupport<Pedido, PedidoResponse> {

    @Getter
    private final PedidoMapper pedidoMapper;

    public PedidoAssembler(@NonNull PedidoMapper pedidoMapper) {
        super(PedidoController.class, PedidoResponse.class);
        this.pedidoMapper = pedidoMapper;
    }
    @Override
    public PedidoResponse toModel(Pedido pedido) {
        return Optional.ofNullable(pedido)
                .map(value -> {
                    PedidoResponse model = pedidoMapper.toResponse(value);
                    model.add(linkTo(getControllerClass()).slash(model.getId()).withSelfRel());
                    return model;
                }).orElse(null);
    }
}
