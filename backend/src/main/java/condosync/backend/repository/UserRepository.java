package condosync.backend.repository;

import condosync.backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByCpf(String cpf);
}
