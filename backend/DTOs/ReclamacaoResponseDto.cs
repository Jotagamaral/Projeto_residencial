// DTOs/ReclamacaoResponseDto.cs
namespace backend.DTOs;

public class ReclamacaoResponseDto
{
    public long Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public long MoradorId { get; set; }
    public string NomeMorador { get; set; } = string.Empty;
    public string BlocoApartamento { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}