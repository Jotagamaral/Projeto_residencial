using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

public class UsuarioCreateDto
{
    /// <summary>Nome completo do usuário.</summary>
    /// <example>João</example>
    [Required]
    public string Nome { get; set; } = string.Empty;

    /// <summary>CPF sem pontos ou traços.</summary>
    /// <example>12345678901</example>
    [Required, StringLength(11)]
    public string Cpf { get; set; } = string.Empty;

    /// <summary>E-mail pessoal para contato e login.</summary>
    /// <example>joao@condosync.com</example>
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>Senha de acesso (mínimo 6 caracteres).</summary>
    /// <example>Senha@123</example>
    [Required]
    public string Senha { get; set; } = string.Empty;
    
    /// <summary>ID da Categoria (2 para Morador, 3 para Funcionário).</summary>
    /// <example>2</example>
    [Required]
    public long CategoriaAcessoId { get; set; }
}