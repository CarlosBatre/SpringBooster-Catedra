package sv.edu.udb.service;

import sv.edu.udb.repository.domain.DetallePedido;

import java.util.List;

public interface DetallePedidoService {
    List<DetallePedido> findAll();
    DetallePedido save(DetallePedido detallePedido);
}
