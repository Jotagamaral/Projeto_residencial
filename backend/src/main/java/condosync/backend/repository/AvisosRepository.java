package condosync.backend.repository;

import condosync.backend.model.Avisos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvisosRepository extends JpaRepository<Avisos, Long> {

    Avisos findByData(String data);
}
