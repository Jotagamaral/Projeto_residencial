// DTOs/CategoriaCargoDtos.cs
namespace backend.src.dtos.CategoriaCargo;

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