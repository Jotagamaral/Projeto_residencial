package condosync.backend.controller;

import condosync.backend.dto.AvisosDTO;
import condosync.backend.model.Avisos;
import condosync.backend.repository.AvisosRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avisos")
public class AvisosController {

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

    // POST: Adiciona um aviso novo
    @PostMapping
    public ResponseEntity<Object> criarAviso(@RequestBody AvisosDTO avisosDTO) {
        
        try {

            if (avisosDTO.getAviso() == null || avisosDTO.getAviso().trim().isEmpty()) {
                    Map<String, Object> badResponse = Map.of(
                        "message", "Erro na criação do aviso.",
                        "error", Map.of(
                                "code", "400",
                                "message", "Aviso não pode ser vazio."
                        )
                );
                throw new Exception("Aviso não pode ser vazio.", new Throwable(badResponse.toString()));
            }

            // Criando aviso
            Avisos novoAviso = new Avisos();
            novoAviso.setAviso(avisosDTO.getAviso());
            novoAviso.setData(avisosDTO.getData() != null ? avisosDTO.getData() : null);

            Avisos aviso = avisosRepository.save(novoAviso);

            // Reponse
            Map<String, Object> response = Map.of(
                "message", "Aviso criado com sucesso.",
                "aviso", new AvisosDTO(aviso)
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "[ERRO]:" + e.getMessage()));
        }
    }

}
