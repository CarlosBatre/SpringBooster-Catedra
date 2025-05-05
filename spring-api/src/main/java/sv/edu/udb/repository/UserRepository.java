package sv.edu.udb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.repository.domain.SecurityUser;


public interface UserRepository extends JpaRepository<SecurityUser, Long> {

    SecurityUser findByUsername(final String username);

    boolean existsByUsername(final String username);
}
