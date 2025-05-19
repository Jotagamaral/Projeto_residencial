package condosync.backend.dto;

import condosync.backend.model.Reclamacoes;

public class ReclamacoesDTO {
    private Long id;
    private String nome;
    private String reclamacao;
    private Long morador;

    // Construtor
    public ReclamacoesDTO(Reclamacoes reclamacao) {
        this.id = reclamacao.getId();
        this.nome = reclamacao.getnome();
        this.reclamacao = reclamacao.getReclamacao();
        this.morador = reclamacao.getMorador().getId();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getReclamacao() {
        return reclamacao;
    }

    public void setReclamacao(String reclamacao) {
        this.reclamacao = reclamacao;
    }

    public Long getMorador() {
        return morador;
    }

    public void setMorador(Long morador) {
        this.morador = morador;
    }
}
