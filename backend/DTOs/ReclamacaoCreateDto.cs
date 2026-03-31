// DTOs/ReclamacaoCreateDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ReclamacaoCreateDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(100)]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    public string Descricao { get; set; } = string.Empty;
}