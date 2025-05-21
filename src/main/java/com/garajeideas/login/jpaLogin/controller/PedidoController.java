package com.garajeideas.login.jpaLogin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import com.garajeideas.login.jpaLogin.controller.request.PedidoRequest;
import com.garajeideas.login.jpaLogin.controller.response.PedidoResponse;
import com.garajeideas.login.jpaLogin.service.PedidoService;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;


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
    public PagedModel<PedidoResponse> listarPedidos(Pageable pageable) {return pedidoService.listarPedidos(pageable);}
    
    @GetMapping("/{id}")
    public PedidoResponse obtenerPedidoPorId(@PathVariable Long id) {
        return pedidoService.obtenerPedidoPorId(id);
    }

}
