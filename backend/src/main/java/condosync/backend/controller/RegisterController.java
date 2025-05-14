package condosync.backend.controller;

import condosync.backend.dao.FuncionariosDAO;
import condosync.backend.model.Funcionarios;

import condosync.backend.dao.MoradoresDAO;
import condosync.backend.model.Moradores;

import condosync.backend.dao.UserDAO;
import condosync.backend.model.User;


import condosync.backend.dto.RegisterDTO;

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
public class RegisterController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private MoradoresDAO moradoresDAO;

    @Autowired
    private FuncionariosDAO funcionariosDAO;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterDTO registerDTO) {
        try {
            if (userDAO.buscarUserPorCpf(registerDTO.getCpf().trim()) != null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Usuário já cadastrado."));
            }

            User user = new User();
            user.setCpf(registerDTO.getCpf());
            user.setSenha(registerDTO.getSenha());
            user.setCategoria(registerDTO.getTipoUsuario());
            
            userDAO.inserirUser(user);


            if (registerDTO.getTipoUsuario().equals("Morador")) {
                Moradores moradores = new Moradores();
                moradores.setNome(registerDTO.getNome());
                moradores.setRg(registerDTO.getRg());
                moradores.setCpf(registerDTO.getCpf());
                moradores.setTelefone(registerDTO.getTelefone());
                moradores.setEmail(registerDTO.getEmail());
                moradores.setApartamento(registerDTO.getApartamento());
                moradores.setBloco(registerDTO.getBloco());
                moradores.setUser(user);
                moradoresDAO.inserirMorador(moradores);

            } else if (registerDTO.getTipoUsuario().equals("Funcionário")) {
                Funcionarios funcionarios = new Funcionarios();
                funcionarios.setNome(registerDTO.getNome());
                funcionarios.setRg(registerDTO.getRg());
                funcionarios.setCpf(registerDTO.getCpf());
                funcionarios.setTelefone(registerDTO.getTelefone());
                funcionarios.setEmail(registerDTO.getEmail());
                funcionarios.setCargo(registerDTO.getCargo());
                funcionarios.setUser(user);
                funcionariosDAO.inserirFuncionario(funcionarios);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Usuário cadastrado com sucesso."));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "ERRO:" + e.getMessage()));
        }
    }
}
