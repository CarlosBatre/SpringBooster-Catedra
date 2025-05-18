package sv.edu.udb.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.controller.request.PedidoRequest;
import sv.edu.udb.controller.response.PedidoResponse;
import sv.edu.udb.service.PedidoService;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping(path = "pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    @ResponseStatus(CREATED)
    public PedidoResponse realizarPedido(@Valid @RequestBody PedidoRequest request) {
        return pedidoService.realizarPedido(request);
    }
    @GetMapping
    public List<PedidoResponse> obtenerPedidos() {
        return pedidoService.listarPedidos();
    }
    @GetMapping("/{id}")
    public PedidoResponse obtenerPedidoPorId(@PathVariable Long id) {
        return pedidoService.obtenerPedidoPorId(id);
    }

}
