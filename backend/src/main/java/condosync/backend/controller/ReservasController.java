package condosync.backend.controller;

import condosync.backend.dto.ReservasDTO;
import condosync.backend.repository.ReservasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
public class ReservasController {

    private ReservasRepository reservasRepository;

    @Autowired
    public ReservasController(ReservasRepository reservasRepository) {
        this.reservasRepository = reservasRepository;
    }

    @GetMapping
    public List<ReservasDTO> listarTodos() {
        return reservasRepository.findAll().stream()
                .map(ReservasDTO::new)
                .collect(Collectors.toList());
    }
}