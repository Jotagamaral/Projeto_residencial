package condosync.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterDTO {
    @NotBlank(message = "Tipo de usuário é obrigatório")
    private String tipoUsuario;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    private String rg;

    private String telefone;

    @NotBlank(message = "Email é obrigatório")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    private Integer apartamento;

    private Character bloco;

    private String cargo;


    // Getters and Setters
    public String getTipoUsuario() {
        return tipoUsuario;
    }
    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }
    public void setRg(String rg) {
        this.rg = rg;
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

    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
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

    public String getCargo() {
        return cargo;
    }
    public void setCargo(String cargo) {
        this.cargo = cargo;
    }
}
