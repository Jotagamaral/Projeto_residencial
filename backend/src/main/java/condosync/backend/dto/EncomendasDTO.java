package condosync.backend.dto;

import java.time.LocalDateTime;

import condosync.backend.model.Encomendas;

public class EncomendasDTO {
    private Long id;
    private String remetente;
    private String destinatario;
    private String apartamento;
    private LocalDateTime horaEntrega;

    // Construtor
    public EncomendasDTO(Encomendas encomenda) {
        this.id = encomenda.getId();
        this.remetente = encomenda.getRemetente();
        this.destinatario = encomenda.getMorador().getNome(); // Supondo que Morador tem um campo "nome"
        this.apartamento = encomenda.getApartamento();
        this.horaEntrega = encomenda.getHoraEntrega();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRemetente() {
        return remetente;
    }

    public void setRemetente(String remetente) {
        this.remetente = remetente;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }

    public String getApartamento() {
        return apartamento;
    }

    public void setApartamento(String apartamento) {
        this.apartamento = apartamento;
    }

    public LocalDateTime getHoraEntrega() {
        return horaEntrega;
    }

    public void setHoraEntrega(LocalDateTime horaEntrega) {
        this.horaEntrega = horaEntrega;
    }
}
