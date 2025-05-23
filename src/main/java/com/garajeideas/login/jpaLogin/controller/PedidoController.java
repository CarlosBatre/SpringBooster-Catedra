package com.garajeideas.login.jpaLogin.controller;

import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse realizarPedido(@Valid @RequestBody PedidoRequest request) {
        return pedidoService.realizarPedido(request);
    }

    @GetMapping
    public PagedModel<PedidoResponse> listarPedidos(Pageable pageable) {
        return pedidoService.listarPedidos(pageable);
    }

    @GetMapping("/{id}")
    public PedidoResponse obtenerPedidoPorId(@PathVariable Long id) {
        return pedidoService.obtenerPedidoPorId(id);
    }
    @PutMapping("/{id}")
    public PedidoResponse actualizarPedido(@PathVariable Long id, @Valid @RequestBody PedidoRequest request) {
        return pedidoService.actualizarPedido(id, request);
    }
}
