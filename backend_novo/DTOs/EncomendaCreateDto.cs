using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

public class EncomendaCreateDto
{
    [Required]
    public string Remetente { get; set; } = string.Empty;

    [Required]
    public long MoradorId { get; set; }
}
