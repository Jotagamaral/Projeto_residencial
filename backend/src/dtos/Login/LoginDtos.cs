using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Login;

public class LoginDto
{
    /// <summary>CPF cadastrado (somente números).</summary>
    /// <example>12345678901</example>
    [Required, StringLength(11)]
    public string Cpf { get; set; } = string.Empty;

    /// <summary>Senha definida no cadastro.</summary>
    /// <example>Senha@123</example>
    [Required]
    public string Senha { get; set; } = string.Empty;
}
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
