using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

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