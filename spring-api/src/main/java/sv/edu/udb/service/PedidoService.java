package sv.edu.udb.service;

import sv.edu.udb.controller.request.PedidoRequest;
import sv.edu.udb.controller.response.PedidoResponse;

import java.util.List;

public interface PedidoService {
    PedidoResponse realizarPedido(PedidoRequest request);
    List<PedidoResponse> listarPedidos();
    PedidoResponse obtenerPedidoPorId(Long id);

}
