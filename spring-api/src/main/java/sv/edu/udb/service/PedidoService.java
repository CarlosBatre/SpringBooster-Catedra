package sv.edu.udb.service;

import sv.edu.udb.controller.request.PedidoRequest;
import sv.edu.udb.controller.response.PedidoResponse;

public interface PedidoService {
    PedidoResponse realizarPedido(PedidoRequest request);

}
