package condosync.backend.repository;

import condosync.backend.model.Encomendas;
import condosync.backend.model.Funcionarios;
import condosync.backend.model.Moradores;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncomendasRepository extends JpaRepository<Encomendas, Long> {
    List<Encomendas> findByFuncionario(Funcionarios funcionario);
    List<Encomendas> findByMorador(Moradores morador);
}
