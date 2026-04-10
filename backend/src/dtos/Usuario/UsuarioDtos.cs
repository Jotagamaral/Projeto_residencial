using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Usuario;

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

    /// <summary>Nº do Rg do usuário.</summary>
    /// <example>1928347432</example>
    public string? Rg { get; set; }

    /// <summary>Nº do Celular do usuário.</summary>
    /// <example>61992324334</example>
    public string? Celular { get; set; }
    
    /// <summary>Nº do apartamento (obrigatório se for Morador).</summary>
    /// <example>101</example>
    
    public int? Apartamento { get; set; }

    /// <summary>Bloco do apartamento (obrigatório se for Morador).</summary>
    /// <example>A</example>
    public string? Bloco { get; set; }

    /// <summary>ID da categoria do cargo (obrigatório se for Funcionário).</summary>
    /// <example>2</example>
    public long? CargoId { get; set; }
    
    /// <summary>Senha de acesso (mínimo 6 caracteres).</summary>
    /// <example>Senha@123</example>
    [Required]
    public string Senha { get; set; } = string.Empty;
    
    /// <summary>ID da Categoria (2 para Morador, 3 para Funcionário).</summary>
    /// <example>2</example>
    [Required]
    public long CategoriaAcessoId { get; set; }
}

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