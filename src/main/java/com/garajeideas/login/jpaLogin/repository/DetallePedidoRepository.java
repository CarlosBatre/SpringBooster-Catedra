package com.garajeideas.login.jpaLogin.repository;

import com.garajeideas.login.jpaLogin.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import com.garajeideas.login.jpaLogin.entity.DetallePedido;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findByPedido(Pedido pedido);
}
