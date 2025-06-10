package condosync.backend.dto;

import condosync.backend.model.Avisos;

public class AvisosDTO {
    private Long id;
    private String aviso;
    private String data;

    // Default Contructor
    public AvisosDTO() {}

    //Contructor
    public AvisosDTO(Avisos aviso) {
        this.id = aviso.getId();
        this.aviso = aviso.getAviso();
        this.data = aviso.getData();
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
