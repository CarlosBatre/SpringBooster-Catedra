package com.garajeideas.login.jpaLogin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCliente;
    private String direccion;
    private String email;
    private String telefono;
    private String metodoPago;
    private String estado;
    private LocalDate fechaPedido;
    private Double total;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = "Pedido Realizado";
        }
        if (fechaPedido == null) {
            fechaPedido = LocalDate.now();
        }
    }
}
