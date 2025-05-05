package condosync.backend.controller;

import condosync.backend.dto.EncomendasDTO;
import condosync.backend.repository.EncomendasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/encomendas")
public class EncomendasController {
    // Injeção de dependência do repositório de encomendas
    private final EncomendasRepository EncomendasRepository;

    // Construtor para injeção de dependência
    @Autowired
    public EncomendasController(EncomendasRepository EncomendasRepository) {
        this.EncomendasRepository = EncomendasRepository;
    }

    // GET: Retorna todas as encomendas 
    @GetMapping
    public List<EncomendasDTO> listarTodos() {
        return EncomendasRepository.findAll().stream()
            .map(EncomendasDTO::new)
            .collect(Collectors.toList());
    }
}
