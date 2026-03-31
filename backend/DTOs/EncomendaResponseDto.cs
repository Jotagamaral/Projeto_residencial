using System.Text.Json.Serialization;

namespace backend.DTOs;

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
