package condosync.backend.controller;

import condosync.backend.dto.ReclamacoesDTO;
import condosync.backend.repository.ReclamacoesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reclamacoes")
public class ReclamacaoController {

    private ReclamacoesRepository reclamacoesRepository;

    @Autowired
    public ReclamacaoController(ReclamacoesRepository reclamacoesRepository) {
        this.reclamacoesRepository = reclamacoesRepository;
    }

    @GetMapping
    public List<ReclamacoesDTO> listarTodos() {
        return reclamacoesRepository.findAll().stream()
                .map(ReclamacoesDTO::new)
                .collect(Collectors.toList());
    }
}