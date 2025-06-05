package condosync.backend.dto;

import java.time.LocalDate;
import condosync.backend.model.Reservas;

public class ReservasDTO {
    private Long id;
    private Long local;
    private LocalDate data;
    private Long morador;

    // Contructor Default
    public ReservasDTO(){
        
    }

    // Construtor
    public ReservasDTO(Reservas reservas) {
        this.id = reservas.getId();
        this.local = reservas.getLocal().getId();
        this.morador = reservas.getMorador().getId();
        this.data = reservas.getData();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMorador() {
        return morador;
    }

    public void setMorador(Long morador) {
        this.morador = morador;
    }

    public Long getLocal() {
        return local;
    }

    public void setLocal(Long local) {
        this.local = local;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }
}
