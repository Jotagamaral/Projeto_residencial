// DTOs/MoradorDtos.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class MoradorResponseDto
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string? Bloco { get; set; } = string.Empty;
    public int? Apartamento { get; set; }
}

public class MoradorUpdateDto
{
    [Required(ErrorMessage = "O bloco é obrigatório.")]
    public string Bloco { get; set; } = string.Empty;

    [Range(1, 9999, ErrorMessage = "O número do apartamento deve ser válido.")]
    public int Apartamento { get; set; }
}