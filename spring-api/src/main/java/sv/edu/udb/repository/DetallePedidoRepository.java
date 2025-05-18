package sv.edu.udb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.repository.domain.DetallePedido;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
}
