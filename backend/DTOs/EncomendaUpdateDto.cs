using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class EncomendaUpdateDto
{
    [Required(ErrorMessage = "O status da encomenda é obrigatório.")]
    public long IdCategoriaEncomenda { get; set; }

    public DateTime? DataRetirado { get; set; }
    
    public string? Remetente { get; set; }
}