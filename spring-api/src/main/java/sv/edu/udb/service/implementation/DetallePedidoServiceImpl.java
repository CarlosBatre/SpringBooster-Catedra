package sv.edu.udb.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.edu.udb.repository.DetallePedidoRepository;
import sv.edu.udb.repository.domain.DetallePedido;
import sv.edu.udb.service.DetallePedidoService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetallePedidoServiceImpl implements DetallePedidoService {

    private final DetallePedidoRepository detallePedidoRepository;

    @Override
    public List<DetallePedido> findAll() {
        return detallePedidoRepository.findAll();
    }

    @Override
    public DetallePedido save(DetallePedido detallePedido) {
        // No manejamos fecha ni estado aquí porque es un detalle, no el pedido
        return detallePedidoRepository.save(detallePedido);
    }
}
