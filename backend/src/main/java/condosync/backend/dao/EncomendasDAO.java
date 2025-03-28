package condosync.backend.dao;

import condosync.backend.model.Encomendas;
import condosync.backend.repository.EncomendasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EncomendasDAO {

    @Autowired
    private EncomendasRepository encomendasRepository;

    public Encomendas inserirEncomenda(Encomendas encomenda) {
        return encomendasRepository.save(encomenda);
    }

    public Encomendas atualizarEncomenda(Encomendas encomenda) {
        return encomendasRepository.save(encomenda);
    }

    public void deletarEncomenda(Long id) {
        encomendasRepository.deleteById(id);
    }

    public List<Encomendas> buscarTodasEncomendas() {
        return encomendasRepository.findAll();
    }

    public Optional<Encomendas> buscarEncomendaPorId(Long id) {
        return encomendasRepository.findById(id);
    }
}
