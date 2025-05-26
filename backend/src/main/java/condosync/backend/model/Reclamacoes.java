package condosync.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reclamacoes")
public class Reclamacoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "nome")
    public String nome = "Anônimo";

    @Column(name = "reclamacao")
    public String reclamacao;

    @OneToOne
    @JoinColumn(name = "fk_morador", referencedColumnName = "id", nullable = true)
    public Moradores morador;

    // Default constructor
    public Reclamacoes() {}


    public Reclamacoes(Long id, String nome, String reclamacao, Moradores morador) {
        this.id = id;
        this.nome = nome;
        this.reclamacao = reclamacao;
        this.morador = morador;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getnome() {
        return nome;
    }

    public void setnome(String nome) {
        this.nome = nome;
    }

    public String getReclamacao() {
        return reclamacao;
    }

    public void setReclamacao(String reclamacao) {
        this.reclamacao = reclamacao;
    }
    public Moradores getMorador() {
        return morador;
    }

    public void setMorador(Moradores morador) {
        this.morador = morador;
    }
}
