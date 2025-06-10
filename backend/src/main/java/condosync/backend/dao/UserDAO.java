package condosync.backend.dao;

import condosync.backend.model.User;
import condosync.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDAO {

    @Autowired
    private UserRepository userRepository;

    public User inserirUser(User user) {
        return userRepository.save(user);
    }

    public User atualizarUser(User user) {
        return userRepository.save(user);
    }

    void deletarUser(User user) {
        userRepository.delete(user);
    }

    public List<User> buscarTodosUsers() {
        return userRepository.findAll();
    }

    public User buscarUserPorId(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User buscarUserPorCpf(String cpf) {
        return userRepository.findByCpf(cpf);
    }
}
