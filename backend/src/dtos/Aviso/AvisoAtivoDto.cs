using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Aviso;

public class AvisoAtivoDto
{
    [Required]
    public bool Ativo { get; set; }
}
