using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class EncomendaCreateDto
{
    [Required]
    public string Remetente { get; set; } = string.Empty;

    [Required]
    public long MoradorId { get; set; }
}
