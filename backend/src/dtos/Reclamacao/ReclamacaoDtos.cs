// DTOs/ReclamacaoDtos.cs
using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Reclamacao;

public class ReclamacaoAdminUpdateDto : ReclamacaoCreateDto
{
    [Required]
    public long IdCategoriaReclamacao { get; set; }
}

public class ReclamacaoCreateDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(100)]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    public string Descricao { get; set; } = string.Empty;
}

public class ReclamacaoPublicaDto
{
    public long Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class ReclamacaoResponseDto
{
    public long Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public long MoradorId { get; set; }
    public string NomeMorador { get; set; } = string.Empty;
    public string BlocoApartamento { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class ReclamacaoUpdateDto : ReclamacaoCreateDto { }