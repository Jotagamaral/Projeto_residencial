// DTOs/CategoriaCargoDtos.cs
namespace backend.DTOs;

public class CategoriaCargoCreateDto
{
    public string Nome { get; set; } = string.Empty;
}

public class CategoriaCargoResponseDto
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
}

public class CategoriaCargoUpdateDto
{
    public string Nome { get; set; } = string.Empty;
}