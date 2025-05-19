package com.garajeideas.login.jpaLogin.service;

import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;

import java.util.List;

public interface PedidoService {
    PedidoResponse realizarPedido(PedidoRequest request);
    List<PedidoResponse> listarPedidos();
    PedidoResponse obtenerPedidoPorId(Long id);

}
