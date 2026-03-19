using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

public class ReservaCreateDto
{
    /// <summary>ID do espaço que será reservado (ex: Churrasqueira).</summary>
    /// <example>1</example>
    [Required]
    public long IdLocal { get; set; }

    /// <summary>Data e hora exata do início da reserva.</summary>
    /// <example>12-03-2026:13:00:00</example>
    [Required]
    public DateTime DataInicio { get; set; }

    /// <summary>Data e hora exata do fim da reserva.</summary>
    /// <example>12-03-2026:20:00:00</example>
    [Required]
    public DateTime DataFim { get; set; }
}