package condosync.backend.dao;

import condosync.backend.model.Moradores;
import condosync.backend.model.Visitantes;
import condosync.backend.repository.VisitantesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitantesDAO {

    @Autowired
    private VisitantesRepository visitantesRepository;

    public Visitantes inserirVisitante(Visitantes visitante) {
        return visitantesRepository.save(visitante);
    }

    public Visitantes atualizarVisistante(Visitantes visitante) {
        return visitantesRepository.save(visitante);
    }

    void deletarVisitante(Visitantes visitante) {
        visitantesRepository.delete(visitante);
    }

    public Visitantes buscarVisitantePorId(Long id) {
        return visitantesRepository.findById(id).orElse(null);
    }

    public List<Visitantes> buscarVisitantesPorNome(String nome) {
        return visitantesRepository.findByNome(nome);
    }

    public List<Visitantes> buscarVisitantesPorCpf(String cpf) {
        return visitantesRepository.findByCpf(cpf);
    }

    public List<Visitantes> buscarVisitantesPorMorador(Moradores morador) {
        return visitantesRepository.findByMorador(morador);
    }
}
