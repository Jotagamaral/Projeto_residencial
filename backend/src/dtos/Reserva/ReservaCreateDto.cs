using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Reserva;

public class ReservaCreateDto
{
    /// <summary>ID do espaço que será reservado (ex: Churrasqueira).</summary>
    /// <example>1</example>
    [Required(ErrorMessage = "O local da reserva é obrigatório.")]
    public long IdLocal { get; set; }

    /// <summary>Data e hora exata do início da reserva.</summary>
    /// <example>12-03-2026:13:00:00</example>
    [Required(ErrorMessage = "A data de início é obrigatória.")]
    public DateTime DataInicio { get; set; }

    /// <summary>Data e hora exata do fim da reserva.</summary>
    /// <example>12-03-2026:20:00:00</example>
    [Required(ErrorMessage = "A data de término é obrigatória.")]
    public DateTime DataFim { get; set; }
}
