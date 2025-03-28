package condosync.backend.repository;

import condosync.backend.model.Locais;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocaisRepository extends JpaRepository<Locais, Long> {
    Locais findByNome(String nome);
}
