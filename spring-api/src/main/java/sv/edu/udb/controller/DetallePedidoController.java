package sv.edu.udb.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sv.edu.udb.repository.domain.DetallePedido;
import sv.edu.udb.service.DetallePedidoService;

import java.util.List;

@RestController
@RequestMapping(path = "pedidos")
@RequiredArgsConstructor
public class DetallePedidoController {

    private final DetallePedidoService detallePedidoService;

    @GetMapping
    public List<DetallePedido> listarPedidos() {
        return detallePedidoService.findAll();
    }
}
