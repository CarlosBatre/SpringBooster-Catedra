package com.garajeideas.login.jpaLogin.service;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;

public interface PedidoService {
    PedidoResponse realizarPedido(PedidoRequest request);
    PagedModel<PedidoResponse> listarPedidos(Pageable pageable);
    PedidoResponse obtenerPedidoPorId(Long id);
    PedidoResponse actualizarPedido(Long id, PedidoRequest request);

}
