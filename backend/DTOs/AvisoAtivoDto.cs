using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class AvisoAtivoDto
{
    [Required]
    public bool Ativo { get; set; }
}
