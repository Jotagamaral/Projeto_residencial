namespace backend.DTOs;

public class ReservaResponseDto
{
    public long Id { get; set; }
    public long IdLocal { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public string Status { get; set; } = string.Empty;


}