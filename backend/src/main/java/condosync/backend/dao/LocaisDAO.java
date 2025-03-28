package condosync.backend.dao;

import condosync.backend.model.Locais;
import condosync.backend.repository.LocaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocaisDAO {

    @Autowired
    private LocaisRepository locaisRepository;

    public Locais inserirLocal(Locais local) {
        return locaisRepository.save(local);
    }

    public Locais atualizarLocal(Locais local) {
        return locaisRepository.save(local);
    }

    void deletarLocal(Locais local) {
        locaisRepository.delete(local);
    }

    public List<Locais> buscarTodasLocais() {
        return locaisRepository.findAll();
    }

    public Locais buscarLocalPeloNome(String nome) {
        return locaisRepository.findByNome(nome);
    }
}
