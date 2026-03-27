// DTOs/ReclamacaoAdminUpdateDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;
public class ReclamacaoAdminUpdateDto : ReclamacaoCreateDto
{
    [Required]
    public long IdCategoriaReclamacao { get; set; }
}