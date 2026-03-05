namespace backend_novo.DTOs;

public class UsuarioCreateDto
{
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public long CategoriaAcessoId { get; set; }
}