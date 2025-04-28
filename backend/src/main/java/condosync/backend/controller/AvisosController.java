package condosync.backend.controller;

import condosync.backend.model.Avisos;
import condosync.backend.repository.AvisosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avisos")
public class AvisosController {

    // Implementar métodos para gerenciar avisos
    // Exemplo: criar, listar, atualizar, excluir avisos
    // Usar o repositório AvisosRepository para interagir com o banco de dados
    // Exemplo de método para listar todos os avisos

    private final AvisosRepository avisosRepository;

    @Autowired
    public AvisosController(AvisosRepository avisosRepository) {
        this.avisosRepository = avisosRepository;
    }

    // GET: Retorna todos os avisos
    @GetMapping
    public List<Avisos> listarTodos() {
        return avisosRepository.findAll();
    }
}
