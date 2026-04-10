using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Reserva;

public class ReservaCalendarioDto
{
    public long IdLocal { get; set; }
    public string NomeLocal { get; set; } = string.Empty;
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
}