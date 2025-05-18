package com.garajeideas.login.jpaLogin.repository;

import com.garajeideas.login.jpaLogin.entity.Empleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadosRepository extends JpaRepository<Empleados, Long> {
    Empleados findByUsername(String username);
} 