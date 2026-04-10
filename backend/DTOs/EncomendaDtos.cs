using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.DTOs;

public class EncomendaCreateDto
{
    [Required]
    public string Remetente { get; set; } = string.Empty;

    [Required]
    public long MoradorId { get; set; }
}

public class EncomendaResponseDto
{
    public long Id { get; set; }
    public string Remetente { get; set; } = string.Empty;
    public long MoradorId { get; set; }
    public string Morador { get; set; } = string.Empty;
    public int? Apartamento { get; set; }
    public long FuncionarioId { get; set; }
    public string Funcionario { get; set; } = string.Empty;

    [JsonPropertyName("horaEntrega")]
    public DateTime DataRecebido { get; set; }

    public DateTime? DataRetirado { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class EncomendaRetiradaDto
{
    [Required(ErrorMessage = "A informação de retirada é obrigatória.")]
    public bool? Retirada { get; set; }
}

public class EncomendaUpdateDto
{
    [Required(ErrorMessage = "O status da encomenda é obrigatório.")]
    public long IdCategoriaEncomenda { get; set; }

    public DateTime? DataRetirado { get; set; }
    
    public string? Remetente { get; set; }
}
