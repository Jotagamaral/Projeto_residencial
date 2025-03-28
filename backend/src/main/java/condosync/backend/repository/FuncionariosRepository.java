package condosync.backend.repository;

import condosync.backend.model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionariosRepository extends JpaRepository<Funcionarios, Long>{
    Funcionarios findByEmail(String email);
    void deleteByEmail(String email);

    Funcionarios findByCpf(String cpf);
}
