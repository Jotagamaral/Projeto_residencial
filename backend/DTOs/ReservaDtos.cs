using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ReservaAdminCreateDto
{
    /// <summary>ID do usuário que reservará o local.</summary>
    /// <example>8</example>
    [Required(ErrorMessage = "O ID do usuário titular da reserva é obrigatório.")]
    public long IdUsuario { get; set; }

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

public class ReservaAdminUpdateDto
{
    [Required(ErrorMessage = "O local da reserva é obrigatório.")]
    public long IdLocal { get; set; }

    [Required(ErrorMessage = "A data de início é obrigatória.")]
    public DateTime DataInicio { get; set; }

    [Required(ErrorMessage = "A data de término é obrigatória.")]
    public DateTime DataFim { get; set; }
}

public class ReservaCalendarioDto
{
    public long IdLocal { get; set; }
    public string NomeLocal { get; set; } = string.Empty;
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
}

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

public class ReservaResponseDto
{
    public long Id { get; set; }
    public long IdLocal { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public string Status { get; set; } = string.Empty;


}

public class ReservaUpdateDto
{
    [Required(ErrorMessage = "O local da reserva é obrigatório.")]
    public long IdLocal { get; set; }

    [Required(ErrorMessage = "A data de início é obrigatória.")]
    public DateTime DataInicio { get; set; }

    [Required(ErrorMessage = "A data de término é obrigatória.")]
    public DateTime DataFim { get; set; }
}
