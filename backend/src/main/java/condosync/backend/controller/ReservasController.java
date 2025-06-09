package condosync.backend.controller;

import condosync.backend.dto.ReservasDTO;
import condosync.backend.model.Locais;
import condosync.backend.model.Moradores;
import condosync.backend.model.Reservas;
import condosync.backend.repository.LocaisRepository;
import condosync.backend.repository.MoradoresRepository;
import condosync.backend.repository.ReservasRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
public class ReservasController {

    private ReservasRepository reservasRepository;
    private MoradoresRepository moradoresRepository;
    private LocaisRepository locaisRepository;

    @Autowired
    public ReservasController(ReservasRepository reservasRepository, MoradoresRepository moradoresRepository, LocaisRepository locaisRepository) {
        this.reservasRepository = reservasRepository;
        this.moradoresRepository = moradoresRepository;
        this.locaisRepository = locaisRepository;
    }

    // GET Reservas
    @GetMapping
    public List<ReservasDTO> listarTodos() {
        return reservasRepository.findAll().stream()
                .map(ReservasDTO::new)
                .collect(Collectors.toList());
    }
    
    // POST Resercas
    @PostMapping
    public ResponseEntity<Object> criarReserva(@RequestBody ReservasDTO reservasDTO) {

        try {

            Optional<Locais> localOptional = locaisRepository.findById(reservasDTO.getLocal());

            if (localOptional.isEmpty()) {
                Map<String, Object> badResponse = Map.of(
                        "message", "Erro na criação da reserva.",
                        "error", Map.of(
                                "code", "400",
                                "message", "Local não pode ser vazio."
                        )
                );
                throw new Exception("Local não pode ser vazio", new Throwable(badResponse.toString()));
            }

            Optional<Moradores> moradorOptional = moradoresRepository.findById(reservasDTO.getMorador());

            if (moradorOptional.isEmpty()) {
                Map<String, Object> badResponse = Map.of(
                        "message", "Erro na criação da reserva.",
                        "error", Map.of(
                                "code", "400",
                                "message", "Morador não pode ser vazio."
                        )
                );
                throw new Exception("Morador não pode ser vazio", new Throwable(badResponse.toString()));
            }

            Locais local = localOptional.get();
            Moradores morador = moradorOptional.get();

            Reservas novaReserva = new Reservas();
            novaReserva.setLocal(local);
            novaReserva.setMorador(morador);
            novaReserva.setData(reservasDTO.getData());

            Reservas reserva = reservasRepository.save(novaReserva);

            //Response
            Map<String, Object> responseReserva = Map.of(
                "message", "Reserva criada com sucesso",
                "reserva", new ReservasDTO(reserva));

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseReserva);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "[ERRO]:" + e.getMessage()));
        }

    }
}