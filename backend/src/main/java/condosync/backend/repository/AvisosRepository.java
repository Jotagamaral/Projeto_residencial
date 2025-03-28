package condosync.backend.repository;

import condosync.backend.model.Avisos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AvisosRepository extends JpaRepository<Avisos, Long> {
    Optional<Avisos> findById(Long id);
}
