package condosync.backend.controller;

import condosync.backend.model.Locais;
import condosync.backend.repository.LocaisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locais")
public class LocaisController {

    private final LocaisRepository locaisRepository;

    @Autowired
    public LocaisController(LocaisRepository locaisRepository) {
        this.locaisRepository = locaisRepository;
    }

    // GET Locais
    @GetMapping
    public List<Locais> listarTodos() {
        return locaisRepository.findAll();
    }
}