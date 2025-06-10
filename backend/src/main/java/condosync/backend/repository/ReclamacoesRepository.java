package condosync.backend.repository;

import condosync.backend.model.Reclamacoes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclamacoesRepository extends JpaRepository<Reclamacoes, Long> {
    Reclamacoes findByNome(String nome);
}