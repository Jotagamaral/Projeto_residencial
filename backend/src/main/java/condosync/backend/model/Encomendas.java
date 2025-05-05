package condosync.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "encomendas")
public class Encomendas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Comentando a anotação @ManyToOne até que o usuario tenha acesso
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "morador_id", nullable = false)
    //@Column(name = "morador_id", nullable = false)
    private Moradores morador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id", nullable = false)
    //@Column(name = "funcionario_id", nullable = false)
    private Funcionarios funcionario;

    @Column(name = "hora_entrega", nullable = false)
    private LocalDateTime horaEntrega;

    @Column(name = "remetente", nullable = false)
    private String remetente;

    @Column(name = "apartamento", nullable = false)
    private String apartamento;

    public Encomendas() {}

    public Encomendas(Moradores morador, Funcionarios funcionario, LocalDateTime horaEntrega, String remetente, String apartamento) {
        this.morador = morador;
        this.funcionario = funcionario;
        this.horaEntrega = horaEntrega;
        this.remetente = remetente;
        this.apartamento = apartamento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Moradores getMorador() {
        return morador;
    }

    public void setMorador(Moradores morador) {
        this.morador = morador;
    }

    public Funcionarios getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionarios funcionario) {
        this.funcionario = funcionario;
    }

    public LocalDateTime getHoraEntrega() {
        return horaEntrega;
    }

    public void setHoraEntrega(LocalDateTime horaEntrega) {
        this.horaEntrega = horaEntrega;
    }

    public String getRemetente() {
        return remetente;
    }

    public void setRemetente(String remetente) {
        this.remetente = remetente;
    }

    public String getApartamento() {
        return apartamento;
    }

    public void setApartamento(String apartamento) {
        this.apartamento = apartamento;
    }
}
