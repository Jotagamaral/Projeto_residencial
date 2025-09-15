package condosync.backend.controller;

import condosync.backend.services.RegisterService;

import condosync.backend.dao.FuncionariosDAO;
import condosync.backend.model.Funcionarios;

import condosync.backend.dao.MoradoresDAO;
import condosync.backend.model.Moradores;

import condosync.backend.dao.UserDAO;
import condosync.backend.model.User;
import condosync.backend.dto.RegisterDTO;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RegisterController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private MoradoresDAO moradoresDAO;

    @Autowired
    private FuncionariosDAO funcionariosDAO;

    @Autowired
    private RegisterService RegisterService;

    @PostMapping("/register")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterDTO registerDTO) {
        try {
            String cpf = registerDTO.getCpf().strip();
            if (userDAO.buscarUserPorCpf(cpf) != null) {
                throw new Exception("Usuário já cadastrado.");
            }

            boolean cpfValido = RegisterService.validarCpf(cpf);
            if (!cpfValido) {
                throw new Exception("CPF inválido.");
            }

            User user = new User();
            user.setCpf(registerDTO.getCpf());
            user.setSenha(registerDTO.getSenha());
            user.setCategoria(registerDTO.getTipoUsuario());

            if (registerDTO.getTipoUsuario().equals("MORADOR")) {
                Moradores moradores = new Moradores();
                moradores.setNome(registerDTO.getNome());
                moradores.setRg(registerDTO.getRg());
                moradores.setCpf(registerDTO.getCpf());
                moradores.setTelefone(registerDTO.getTelefone());
                moradores.setEmail(registerDTO.getEmail());

                int apartamento = registerDTO.getApartamento();
                char bloco = registerDTO.getBloco();

                if (apartamento <= 0 || bloco == '\0') {
                    throw new Exception("Apartamento e bloco devem ser informados corretamente.");
                }

                moradores.setApartamento(apartamento);
                moradores.setBloco(bloco);
                moradores.setUser(user);
                userDAO.inserirUser(user);
                moradoresDAO.inserirMorador(moradores);

            } else if (registerDTO.getTipoUsuario().equals("FUNCIONARIO")) {
                Funcionarios funcionarios = new Funcionarios();
                funcionarios.setNome(registerDTO.getNome());
                funcionarios.setRg(registerDTO.getRg());
                funcionarios.setCpf(registerDTO.getCpf());
                funcionarios.setTelefone(registerDTO.getTelefone());
                funcionarios.setEmail(registerDTO.getEmail());

                String cargo = registerDTO.getCargo();

                if (cargo == null || cargo.isEmpty()) {
                    throw new Exception("Cargo deve ser informado.");
                }

                funcionarios.setCargo(cargo);
                funcionarios.setUser(user);
                userDAO.inserirUser(user);
                funcionariosDAO.inserirFuncionario(funcionarios);
            }

            Map<String, Object> response = Map.of(
                    "message", "Usuário cadastrado com sucesso.",
                    "User", Map.of(
                            "id", user.getId(),
                            "nome", registerDTO.getNome()
                    )
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "[ERRO]:" + e.getMessage()));
        }
    }
}
