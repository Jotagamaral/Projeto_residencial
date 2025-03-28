package condosync.backend.dao;

import condosync.backend.model.Funcionarios;
import condosync.backend.repository.FuncionariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionariosDAO {

    @Autowired
    private FuncionariosRepository funcionariosRepository;

    public Funcionarios inserirFuncionario(Funcionarios funcionario) {
        return funcionariosRepository.save(funcionario);
    }

    public Funcionarios atualizarFuncionario(Funcionarios funcionario) {
        return funcionariosRepository.save(funcionario);
    }

    void deletarFuncionario(Funcionarios funcionario) {
        funcionariosRepository.delete(funcionario);
    }

    public List<Funcionarios> buscarTodosFuncionarios() {
        return funcionariosRepository.findAll();
    }

    public Funcionarios buscarFuncionarioPorId(Long id) {
        return funcionariosRepository.findById(id).orElse(null);
    }

    public Funcionarios buscarFuncionarioPorCpf(String cpf) {
        return funcionariosRepository.findByCpf(cpf);
    }
}
