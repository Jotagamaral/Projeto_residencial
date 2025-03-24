package condosync.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "locais")
public class Locais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false, unique = true)
    private String nome;

    @Column(name = "capacidade", nullable = false)
    private Integer capacidade;

    public Locais() {}

    public Locais(Long id, String nome, Integer capacidade) {
        this.id = id;
        this.nome = nome;
        this.capacidade = capacidade;
    }

    public Locais(String nome, Integer capacidade) {
        this.nome = nome;
        this.capacidade = capacidade;
    }

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

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }
}
