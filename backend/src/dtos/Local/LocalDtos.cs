// DTOs/LocalDtos.cs
using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Local;

public class LocalResponseDto
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Capacidade { get; set; }
}

public class LocalCreateDto
{
    [Required(ErrorMessage = "O nome do local é obrigatório.")]
    public string Nome { get; set; } = string.Empty;
    
    [Range(1, int.MaxValue, ErrorMessage = "A capacidade deve ser maior que zero.")]
    public int Capacidade { get; set; }
}

public class LocalUpdateDto
{
    [Required(ErrorMessage = "O nome do local é obrigatório.")]
    public string Nome { get; set; } = string.Empty;
    
    [Range(1, int.MaxValue, ErrorMessage = "A capacidade deve ser maior que zero.")]
    public int Capacidade { get; set; }
}