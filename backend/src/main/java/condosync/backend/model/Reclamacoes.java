package condosync.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reclamacoes")
public class Reclamacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "morador")
    public String morador;

    @Column(name = "reclamacao")
    public String reclamacao;

    public Reclamacoes() {}

    public Reclamacoes(Long id, String morador, String reclamacao) {
        this.id = id;
        this.morador = morador;
        this.reclamacao = reclamacao;
    }

    public Reclamacoes(String morador, String reclamacao) {
        this.morador = morador;
        this.reclamacao = reclamacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMorador() {
        return morador;
    }

    public void setMorador(String morador) {
        this.morador = morador;
    }

    public String getReclamacao() {
        return reclamacao;
    }

    public void setReclamacao(String reclamacao) {
        this.reclamacao = reclamacao;
    }
}
