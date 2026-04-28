// DTOs/FuncionarioDtos.cs
using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Funcionario;

public class FuncionarioResponseDto
{
    public long Id { get; set; }
    public string? Nome { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? Cpf { get; set; } = string.Empty;
    public long CargoId { get; set; }
    public string? CargoNome { get; set; } = string.Empty;
}

public class FuncionarioUpdateDto
{
    [Required(ErrorMessage = "O ID do cargo é obrigatório.")]
    [Range(1, long.MaxValue, ErrorMessage = "ID do cargo inválido.")]
    public long CargoId { get; set; }
}

public class FuncionarioUpdateDadosPessoaisDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "O e-mail informado não é válido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CPF é obrigatório.")]
    public string Cpf { get; set; } = string.Empty;

    public string? Telefone { get; set; }

    public string? Rg { get; set; }
}

public class FuncionarioAlterarSenhaDto
{
    [Required(ErrorMessage = "A senha atual é obrigatória.")]
    public string SenhaAtual { get; set; } = string.Empty;

    [Required(ErrorMessage = "A nova senha é obrigatória.")]
    [MinLength(6, ErrorMessage = "A nova senha deve ter no mínimo 6 caracteres.")]
    public string NovaSenha { get; set; } = string.Empty;

    [Required(ErrorMessage = "A confirmação de senha é obrigatória.")]
    [Compare("NovaSenha", ErrorMessage = "A nova senha e a confirmação não conferem.")]
    public string ConfirmarNovaSenha { get; set; } = string.Empty;
}