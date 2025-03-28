package condosync.backend.dao;

import condosync.backend.model.Moradores;
import condosync.backend.repository.MoradoresRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MoradoresDAO {

    @Autowired
    private MoradoresRepository moradoresRepository;

    public Moradores inserirMorador(Moradores morador) {
        return moradoresRepository.save(morador);
    }

    public Moradores atualizarMorador(Moradores morador) {
        return moradoresRepository.save(morador);
    }

    void deletarMorador(Moradores morador) {
        moradoresRepository.delete(morador);
    }

    public List<Moradores> buscarTodosMoradores() {
        return moradoresRepository.findAll();
    }

    public Moradores buscarMoradorPorId(Long id) {
        return moradoresRepository.findById(id).orElse(null);
    }

    public Moradores buscarMoradorPorCpf(String cpf) {
        return moradoresRepository.findByCpf(cpf);
    }
}
