package com.garajeideas.login.jpaLogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garajeideas.login.jpaLogin.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
