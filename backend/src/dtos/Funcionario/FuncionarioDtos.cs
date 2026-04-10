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