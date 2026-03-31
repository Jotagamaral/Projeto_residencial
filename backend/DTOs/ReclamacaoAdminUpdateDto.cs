// DTOs/ReclamacaoAdminUpdateDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;
public class ReclamacaoAdminUpdateDto : ReclamacaoCreateDto
{
    [Required]
    public long IdCategoriaReclamacao { get; set; }
}