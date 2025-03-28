package condosync.backend.repository;

import condosync.backend.model.Moradores;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoradoresRepository extends JpaRepository<Moradores, Long> {
    Moradores findByEmail(String email);
    void deleteByEmail(String email);

    Moradores findByCpf(String cpf);
}
