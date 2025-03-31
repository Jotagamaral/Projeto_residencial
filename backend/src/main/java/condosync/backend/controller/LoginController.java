package condosync.backend.controller;

import condosync.backend.dao.FuncionariosDAO;
import condosync.backend.dao.MoradoresDAO;
import condosync.backend.dto.LoginDTO;
import condosync.backend.model.Funcionarios;
import condosync.backend.model.Moradores;
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
    private MoradoresDAO moradoresDAO;

    @Autowired
    private FuncionariosDAO funcionariosDAO;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDTO loginDTO) {
        try {
            Funcionarios funcionario = funcionariosDAO.buscarFuncionarioPorCpf(loginDTO.getcpf().trim());

            Moradores morador = moradoresDAO.buscarMoradorPorCpf(loginDTO.getcpf().trim());

            if (funcionario != null && morador != null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Erro ao logar, consulte o serviço técnico."));

            } else if (funcionario != null && morador == null && funcionario.getSenha().trim().equals(loginDTO.getsenha().trim())) {
                return ResponseEntity.ok(Map.of(
                        "id", funcionario.getId(),
                        "nome", funcionario.getNome(),
                        "message", "Login realizado com sucesso!"
                ));

            } else if (funcionario == null && morador != null && morador.getSenha().trim().equals(loginDTO.getsenha().trim())) {
                return ResponseEntity.ok(Map.of(
                        "id", morador.getId(),
                        "nome", morador.getNome(),
                        "message", "Login realizado com sucesso!"
                ));

            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Credenciais inválidas. Tente novamente."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "ERRO:" + e.getMessage()));
        }
    }
}
