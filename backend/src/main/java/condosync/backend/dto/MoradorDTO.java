package condosync.backend.dto;

import java.util.List;

public class MoradorDTO {
    private Long id;
    private String nome;
    private String rg;
    private String cpf;
    private String telefone;
    private String email;
    private int apartamento;
    private String bloco;

    private List<VisitanteDTO> visitantes;

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
    
        public String getRg() {
            return rg;
        }
    
        public void setRg(String rg) {
            this.rg = rg;
        }
    
        public String getCpf() {
            return cpf;
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

        public int getApartamento() {
            return apartamento;
        }

        public void setApartamento(int apartamento) {
            this.apartamento = apartamento;
        }

        public String getBloco() {
            return bloco;
        }

        public void setBloco(String bloco) {
            this.bloco = bloco;
        }
        
        public List<VisitanteDTO> getVisitantes() {
            return visitantes;
        }
        
        public void setVisitantes(List<VisitanteDTO> visitantes) {
            this.visitantes = visitantes;
        }
    }