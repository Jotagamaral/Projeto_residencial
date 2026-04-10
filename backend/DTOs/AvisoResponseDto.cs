namespace backend.DTOs;

public class AvisoResponseDto
{
    public long Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public DateTime? DataInicio { get; set; }
    public DateTime? DataExpiracao { get; set; }
    public bool Ativo { get; set; }
}
