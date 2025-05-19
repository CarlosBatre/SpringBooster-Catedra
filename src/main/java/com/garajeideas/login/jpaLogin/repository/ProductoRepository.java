package com.garajeideas.login.jpaLogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sv.edu.udb.repository.domain.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
