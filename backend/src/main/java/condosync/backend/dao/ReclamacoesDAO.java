package condosync.backend.dao;

import condosync.backend.model.Reclamacoes;
import condosync.backend.repository.ReclamacoesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReclamacoesDAO {

    @Autowired
    private ReclamacoesRepository reclamacoesRepository;

    public Reclamacoes inserirReclamacao(Reclamacoes reclamacao) {
        return reclamacoesRepository.save(reclamacao);
    }

    public Reclamacoes atualizarReclamacao(Reclamacoes reclamacao) {
        return reclamacoesRepository.save(reclamacao);
    }

    void deletarReclamacao(Reclamacoes reclamacao) {
        reclamacoesRepository.delete(reclamacao);
    }

    public List<Reclamacoes> findAllReclamacoes() {
        return reclamacoesRepository.findAll();
    }

    public Reclamacoes findById(Long id) {
        return reclamacoesRepository.findById(id).orElse(null);
    }

    public Reclamacoes findByNome(String nome) {
        return reclamacoesRepository.findByNome(nome);
    }
}
