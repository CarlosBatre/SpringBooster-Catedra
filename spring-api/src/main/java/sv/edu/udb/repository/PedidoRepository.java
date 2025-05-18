package sv.edu.udb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.repository.domain.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
