package com.garajeideas.login.jpaLogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.garajeideas.login.jpaLogin.entity.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
