package condosync.backend.model;

import jakarta.persistence.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name = "avisos")
public class Avisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aviso", nullable = false)
    private String aviso;

    @Column(name = "data", nullable = false)
    private String data = new SimpleDateFormat("dd/MM/yyyy").format(new Date());

    public Avisos() {}

    public Avisos(Long id, String aviso, String data) {
        this.id = id;
        this.aviso = aviso;
        this.data = data;
    }

    public Avisos(String aviso, String data) {
        this.aviso = aviso;
        this.data = data;
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

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
