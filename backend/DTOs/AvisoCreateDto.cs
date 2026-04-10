using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class AvisoCreateDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(100)]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "A data de expiração é obrigatória.")]
    public DateTime DataExpiracao { get; set; }
}
