package condosync.backend.controller;

import condosync.backend.dto.EncomendasDTO;
import condosync.backend.model.Encomendas;
import condosync.backend.model.Funcionarios;
import condosync.backend.model.Moradores;
import condosync.backend.repository.EncomendasRepository;
import condosync.backend.repository.FuncionariosRepository;
import condosync.backend.repository.MoradoresRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/encomendas")
public class EncomendasController {
    // Injeção de dependência do repositório de encomendas
    private EncomendasRepository encomendasRepository;
    private MoradoresRepository moradoresRepository; 
    private FuncionariosRepository funcionariosRepository;

    // Construtor para injeção de dependência
    @Autowired
    public EncomendasController(EncomendasRepository encomendasRepository, MoradoresRepository moradoresRepository, FuncionariosRepository funcionariosRepository) {
        this.encomendasRepository = encomendasRepository;
        this.moradoresRepository = moradoresRepository;
        this.funcionariosRepository = funcionariosRepository;
    }

    // GET: Retorna todas as encomendas 
    @GetMapping
    public List<EncomendasDTO> listarTodos() {
        return encomendasRepository.findAll().stream()
            .map(EncomendasDTO::new)
            .collect(Collectors.toList());
    }

    // POST Encomendas

    @PostMapping
    public ResponseEntity<Object> criarEncomenda(@RequestBody EncomendasDTO encomendasDTO) {

        try {
            // ERRORS
            if (encomendasDTO.getApartamento().trim().isEmpty()) {
                // Preparar badResponse
                Map<String, Object> badResponse = Map.of(
                    "message","Erro na criação da encomenda",
                    "error",Map.of(
                            "code","400",
                            "message","Apartamento não pode ser vazio"));

                throw new Exception("[Erro]: EncomendaDTO", new Throwable(badResponse.toString()));
            }

            Optional<Moradores> moradorOptional = moradoresRepository.findById(encomendasDTO.getMoradorId());

            if (moradorOptional.isEmpty()) {
                 // Preparar badResponse
                Map<String, Object> badResponse = Map.of(
                    "message","Erro na criação da encomenda",
                    "error",Map.of(
                            "code","400",
                            "message","Morador não pode ser vazio"));

                throw new Exception("[Erro]: EncomendaDTO", new Throwable(badResponse.toString()));
            }

            Optional<Funcionarios> funcionarioOptional = funcionariosRepository.findById(encomendasDTO.getFuncionarioId());

            if (funcionarioOptional.isEmpty()) {
                // Preparar badResponse
                Map<String, Object> badResponse = Map.of(
                    "message", "Erro na criação da encomenda",
                    "error", Map.of(
                        "code", "400",
                        "message", "Funcionário não pode ser vazio"));

                throw new Exception("[Erro]: EncomendaDTO", new Throwable(badResponse.toString()));
            }

            // Criando Encomenda
            
            Moradores morador = moradorOptional.get();
            Funcionarios funcionarios = funcionarioOptional.get();

            Encomendas novaEncomenda = new Encomendas();
            novaEncomenda.setRemetente(encomendasDTO.getRemetente());
            novaEncomenda.setMorador(morador);
            novaEncomenda.setFuncionario(funcionarios);
            novaEncomenda.setApartamento(encomendasDTO.getApartamento());
            novaEncomenda.setHoraEntrega(encomendasDTO.getHoraEntrega());
            Encomendas encomendaSalva = encomendasRepository.save(novaEncomenda);
            EncomendasDTO encomenda = new EncomendasDTO(encomendaSalva);

            Map<String, Object> responseEncomenda = Map.of(
                "message", "Encomenda criada com sucesso",
                "encomenda", encomenda);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(responseEncomenda);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "[ERRO throw]: " + e.getMessage()));
        }

    }
}
