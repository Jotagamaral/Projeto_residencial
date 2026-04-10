using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Reserva;

public class ReservaAdminUpdateDto
{
    [Required(ErrorMessage = "O local da reserva é obrigatório.")]
    public long IdLocal { get; set; }

    [Required(ErrorMessage = "A data de início é obrigatória.")]
    public DateTime DataInicio { get; set; }

    [Required(ErrorMessage = "A data de término é obrigatória.")]
    public DateTime DataFim { get; set; }
}
