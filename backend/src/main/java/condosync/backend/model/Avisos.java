package condosync.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "avisos")
public class Avisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aviso", nullable = false)
    private String aviso;

    public Avisos() {}

    public Avisos(Long id, String aviso) {
        this.id = id;
        this.aviso = aviso;
    }

    public Avisos(String aviso) {
        this.aviso = aviso;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAviso() {
        return aviso;
    }

    public void setAviso(String aviso) {
        this.aviso = aviso;
    }
}
