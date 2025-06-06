package condosync.backend.controller;

import condosync.backend.dto.ReclamacoesDTO;
import condosync.backend.model.Reclamacoes;
import condosync.backend.model.Moradores;
import condosync.backend.repository.ReclamacoesRepository;
import condosync.backend.repository.MoradoresRepository; // Importar o MoradoresRepository

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional; // Importar Optional
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reclamacoes")
public class ReclamacaoController {

    private ReclamacoesRepository reclamacoesRepository;
    private MoradoresRepository moradoresRepository; // Adicionar o repositório de moradores

    @Autowired
    public ReclamacaoController(ReclamacoesRepository reclamacoesRepository, MoradoresRepository moradoresRepository) {
        this.reclamacoesRepository = reclamacoesRepository;
        this.moradoresRepository = moradoresRepository;
    }

    // GET Reclamações
    @GetMapping
    public List<ReclamacoesDTO> listarTodos() {
        return reclamacoesRepository.findAll().stream()
                .map(ReclamacoesDTO::new)
                .collect(Collectors.toList());
    }

    // POST Reclamações
    @PostMapping
    public ResponseEntity<Object> criarReclamacao(@RequestBody ReclamacoesDTO reclamacaoDTO) {

        try {
            // ERRORS
            if (reclamacaoDTO.getReclamacao() == null || reclamacaoDTO.getReclamacao().trim().isEmpty()) {
                // Preparar response
                Map<String, Object> badResponse = Map.of(
                            "message", "Erro na criação da reclamação.",
                            "error", Map.of(
                                    "code", "400",
                                    "message", "Reclamação não pode ser vazia."
                            )
                    );

                throw new Exception("[ERRO]: ReclamacaoDTO", new Throwable(badResponse.toString()));
            }

            if (reclamacaoDTO.getMoradorId() == null) {
                // Preparar response
                Map<String, Object> badResponse = Map.of(
                            "message", "Erro na criação da reclamação.",
                            "error", Map.of(
                                    "code", "400",
                                    "message", "ID do morador não pode ser vazio."
                            )
                    );

                throw new Exception("[ERRO]: ReclamacaoDTO", new Throwable(badResponse.toString()));
            }

            Optional<Moradores> moradorOptional = moradoresRepository.findById(reclamacaoDTO.getMoradorId());
            
            if (moradorOptional.isEmpty()) {
                // Preparar response
                Map<String, Object> badResponse = Map.of(
                            "message", "Erro na criação da reclamação.",
                            "error", Map.of(
                                    "code", "404",
                                    "message", "Morador não encontrado."
                            )
                    );

                throw new Exception("[ERRO]: ReclamacaoDTO", new Throwable(badResponse.toString()));
            }

            // Criando reclamacao
            Moradores morador = moradorOptional.get();

            Reclamacoes novaReclamacao = new Reclamacoes();
            novaReclamacao.setReclamacao(reclamacaoDTO.getReclamacao());
            novaReclamacao.setMorador(reclamacaoDTO.getMoradorId() != null ? morador : null);
            novaReclamacao.setNome(reclamacaoDTO.getNome());

            Reclamacoes reclamacao = reclamacoesRepository.save(novaReclamacao);

            // Response
            Map<String, Object> responseReclamacao = Map.of(
                "message", "Reclamação criada com sucesso.",
                "aviso", new ReclamacoesDTO(reclamacao)
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseReclamacao);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "[ERRO]:" + e.getMessage()));
        }
    }
}