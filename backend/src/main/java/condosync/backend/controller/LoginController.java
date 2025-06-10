package condosync.backend.controller;


import condosync.backend.dao.FuncionariosDAO;
import condosync.backend.dao.MoradoresDAO;
import condosync.backend.dao.UserDAO;

import condosync.backend.dto.LoginDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private MoradoresDAO moradoresDAO;

    @Autowired
    private FuncionariosDAO funcionariosDAO;


    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDTO loginDTO) {
        try {

            var user = userDAO.buscarUserPorCpf(loginDTO.getCpf().trim());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Usuário não encontrado."));
            }

            if (user.getSenha().equals(loginDTO.getSenha())) {
                // Return success response with user details
                var category = user.getCategoria();

                Long id = null;
                String nome = null;

                if (category.equals("MORADOR")) {
                    var morador = moradoresDAO.buscarMoradorPorCpf(loginDTO.getCpf().trim());
                    id = morador.getId();
                    nome = morador.getNome();

                } else if (category.equals("FUNCIONARIO")) {
                    var funcionario = funcionariosDAO.buscarFuncionarioPorCpf(loginDTO.getCpf().trim());
                    id = funcionario.getId();
                    nome = funcionario.getNome();
                }

                Map<String, Object> response = Map.of(
                        "message", "Login realizado com sucesso!",
                        "user", Map.of(
                                "id", id,
                                "nome", nome,
                                "cpf", user.getCpf(),
                                "categoria", user.getCategoria()
                        ),
                        "token", "dummy-jwt-token"
                );

                return ResponseEntity.ok(response);

            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Senha incorreta."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "[ERRO]:" + e.getMessage()));
        }
    }
}
