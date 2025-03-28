package condosync.backend.repository;

import condosync.backend.model.Moradores;
import condosync.backend.model.Visitantes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitantesRepository extends JpaRepository<Visitantes, Long> {
    List<Visitantes> findByMorador(Moradores morador);
    List<Visitantes> findByCpf(String cpf);
    List<Visitantes> findByNome(String nome);
}
