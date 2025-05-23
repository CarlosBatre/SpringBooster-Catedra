package com.garajeideas.login.jpaLogin.service.assembler;

import com.garajeideas.login.jpaLogin.controller.PedidoController;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import com.garajeideas.login.jpaLogin.service.mapper.PedidoMapper;

import lombok.Getter;
import lombok.NonNull;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

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
        PedidoResponse model = pedidoMapper.toPedidoResponse(pedido);
        model.add(linkTo(methodOn(PedidoController.class).obtenerPedidoPorId(pedido.getId())).withSelfRel());
        return model;
    }
}
