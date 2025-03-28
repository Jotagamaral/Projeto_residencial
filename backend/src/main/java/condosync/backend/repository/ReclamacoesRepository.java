package condosync.backend.repository;

import condosync.backend.model.Reclamacoes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReclamacoesRepository extends JpaRepository<Reclamacoes, Long> {
    Optional<Reclamacoes> findById(Long id);
    Reclamacoes findByNome(String nome);
}