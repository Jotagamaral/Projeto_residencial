using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

public class LoginDto
{
    /// <summary>E-mail cadastrado.</summary>
    /// <example>joao@condosync.com</example>
    [Required]
    public string Email { get; set; } = string.Empty;

    /// <summary>Senha definida no cadastro.</summary>
    /// <example>Senha@123</example>
    [Required]
    public string Senha { get; set; } = string.Empty;
}