package condosync.backend.dto;

public class LocaisDTO {
    private Long id;
    private String nome;
    private int capacidade;

    // Construtor Default
    public LocaisDTO() {
    }

    // Construtor
    public LocaisDTO(Long id, String nome, int capacidade) {
        this.id = id;
        this.nome = nome;
        this.capacidade = capacidade;
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

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }
}
