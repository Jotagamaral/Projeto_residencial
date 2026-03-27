using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

public class EncomendaRetiradaDto
{
    [Required(ErrorMessage = "A informação de retirada é obrigatória.")]
    public bool? Retirada { get; set; }
}
