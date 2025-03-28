package condosync.backend.dao;

import condosync.backend.model.Avisos;
import condosync.backend.repository.AvisosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvisosDAO {

    @Autowired
    private AvisosRepository avisosRepository;

    public Avisos inserirAviso(Avisos aviso) {
        return avisosRepository.save(aviso);
    }

    public Avisos atualizarAviso(Avisos aviso) {
        return avisosRepository.save(aviso);
    }

    public void deletarAviso(Long id) {
        avisosRepository.deleteById(id);
    }

    public List<Avisos> buscarTodosAvisos() {
        return avisosRepository.findAll();
    }

    public Avisos buscarAvisoPorId(Long id) {
        return avisosRepository.findById(id).orElse(null);
    }
}
