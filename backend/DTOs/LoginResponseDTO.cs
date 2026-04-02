namespace backend.DTOs;

public class LoginResponseDTO
{
    /// <summary>Mensagem de status da operação.</summary>
    /// <example>Login realizado com sucesso!</example>
    public string Message { get; set; } = string.Empty;

    /// <summary>Dados resumidos do usuário logado.</summary>
    public UserResponseDTO? User { get; set; }

    /// <summary>Token JWT para autenticação nas rotas protegidas.</summary>
    public string? Token { get; set; }
}

public class UserResponseDTO
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    
    /// <summary>Nome da categoria (ex: MORADOR).</summary>
    /// <example>MORADOR</example>
    public string Categoria { get; set; } = string.Empty;
}
