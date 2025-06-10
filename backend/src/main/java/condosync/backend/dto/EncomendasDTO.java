package condosync.backend.dto;

import java.time.LocalDateTime;

import condosync.backend.model.Encomendas;

public class EncomendasDTO {
    private Long id;
    private Long moradorId;
    private String morador;
    private Long funcionarioId;
    private String funcionario;
    private LocalDateTime horaEntrega;
    private String remetente;
    private int apartamento;

    // Constructor Default
    public EncomendasDTO(){}

    // Construtor
    public EncomendasDTO(Encomendas encomenda) {
        this.id = encomenda.getId();
        this.remetente = encomenda.getRemetente();
        this.moradorId = encomenda.getMorador().getId();
        this.morador = encomenda.getMorador().getNome();
        this.apartamento = encomenda.getMorador().getApartamento();
        this.funcionarioId = encomenda.getFuncionario().getId();
        this.funcionario = encomenda.getFuncionario().getNome();
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

    public Long getMoradorId() {
        return moradorId;
    }

    public void setMoradorId(Long moradorId) {
        this.moradorId = moradorId;
    }

    public String getMorador() {
        return morador;
    }

    public void setMorador(String morador) {
        this.morador = morador;
    }

    public Long getFuncionarioId() {
        return funcionarioId;
    }

    public void setFuncionarioId(Long funcionarioId) {
        this.funcionarioId = funcionarioId;
    }

    public String getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(String funcionario) {
        this.funcionario = funcionario;
    }

    public int getApartamento() {
        return apartamento;
    }

    public void setApartamento(int apartamento) {
        this.apartamento = apartamento;
    }

    public LocalDateTime getHoraEntrega() {
        return horaEntrega;
    }

    public void setHoraEntrega(LocalDateTime horaEntrega) {
        this.horaEntrega = horaEntrega;
    }
}
