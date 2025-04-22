package condosync.backend.controller;

import condosync.backend.model.Moradores;
import condosync.backend.repository.MoradoresRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moradores")
public class MoradoresController {

    private final MoradoresRepository moradoresRepository;

    @Autowired
    public MoradoresController(MoradoresRepository moradoresRepository) {
        this.moradoresRepository = moradoresRepository;
    }

    // GET: Retorna todos os moradores
    @GetMapping
    public List<Moradores> listarTodos() {
        return moradoresRepository.findAll();
    }
}
