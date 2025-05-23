package com.garajeideas.login.jpaLogin.service.mapper;

import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse.DetallePedidoResponse;
import com.garajeideas.login.jpaLogin.entity.DetallePedido;
import com.garajeideas.login.jpaLogin.entity.Pedido;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PedidoMapper {

    @Mapping(target = "detalles", ignore = true)
    Pedido toPedido(PedidoRequest pedidoRequest);

    @Mapping(target = "producto.id", source = "productoId")
    @Mapping(target = "pedido", ignore = true)
    @Mapping(target = "imagen", ignore = true)
    @Mapping(target = "precioUnitario", ignore = true)
    DetallePedido toDetallePedido(PedidoRequest.ProductoPedido productoPedido);

    @Mapping(target = "detalles", source = "detalles")
    PedidoResponse toPedidoResponse(Pedido pedido);

    List<DetallePedidoResponse> toDetallePedidoResponseList(List<DetallePedido> detalles);

    @Mapping(target = "productoId", source = "producto.id")
    @Mapping(target = "nombreProducto", source = "producto.nombre")
    DetallePedidoResponse toDetallePedidoResponse(DetallePedido detallePedido);
}
