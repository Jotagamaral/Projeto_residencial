package condosync.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "moradores")
public class Moradores {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "rg", nullable = false, unique = true)
    private String rg;

    @Column(name = "cpf", nullable = false, unique = true)
    private String cpf;

    @Column(name = "telefone", nullable = true)
    private String telefone;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "apartamento", nullable = false)
    private Integer apartamento;

    @Column(name = "bloco", nullable = false)
    private Character bloco;

    @OneToMany(mappedBy = "morador", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Visitantes> visitantes = new ArrayList<>();

    public Moradores() {}

    public Moradores(Long id, String nome, String rg, String cpf, String telefone, String email, Integer apartamento,
                     Character bloco, List<Visitantes> visitantes) {
        this.id = id;
        this.nome = nome;
        this.rg = rg;
        this.cpf = cpf;
        this.telefone = telefone;
        this.email = email;
        this.apartamento = apartamento;
        this.bloco = bloco;
        this.visitantes = visitantes;
    }

    public Moradores(String nome, String rg, String cpf, String telefone, String email, Integer apartamento, Character bloco) {
        this.nome = nome;
        this.rg = rg;
        this.cpf = cpf;
        this.telefone = telefone;
        this.email = email;
        this.apartamento = apartamento;
        this.bloco = bloco;
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

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getApartamento() {
        return apartamento;
    }

    public void setApartamento(Integer apartamento) {
        this.apartamento = apartamento;
    }

    public Character getBloco() {
        return bloco;
    }

    public void setBloco(Character bloco) {
        this.bloco = bloco;
    }

    public List<Visitantes> getVisitantes() {
        return visitantes;
    }

    public void setVisitantes(List<Visitantes> visitantes) {
        this.visitantes = visitantes;
    }

    public void adicionarVisitante(Visitantes visitante) {
        this.visitantes.add(visitante);
        visitante.setMorador(this);
    }

    public void removerVisitante(Visitantes visitante) {
        this.visitantes.remove(visitante);
        visitante.setMorador(null);
    }
}
