namespace backend.DTOs;

public class UsuarioResponseDto
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string CategoriaAcesso { get; set; } = string.Empty;

    public object? Detalhes { get; set;}

    // // Se for morador
    // public MoradorResponseDto? DetalhesMorador { get; set; }
    
    // // Se for funcionário
    // public FuncionarioResponseDto? DetalhesFuncionario { get; set; }
}