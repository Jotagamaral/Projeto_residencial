package condosync.backend.dto;

import condosync.backend.model.Reclamacoes;

public class ReclamacoesDTO {
    private Long id;
    private String nome;
    private String reclamacao;
    private Long moradorId;

    // Construtor padrão
    public ReclamacoesDTO() {
    }

    // Construtor
    public ReclamacoesDTO(Reclamacoes reclamacao) {
        this.id = reclamacao.getId();
        this.nome = reclamacao.getNome();
        this.reclamacao = reclamacao.getReclamacao();
        this.moradorId = reclamacao.getMorador().getId();
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

    public Long getMoradorId() {
        return moradorId;
    }

    public void setMoradorId(Long moradorId) {
        this.moradorId = moradorId;
    }
}
