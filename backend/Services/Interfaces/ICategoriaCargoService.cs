// Services/Interfaces/ICategoriaCargoService.cs
using backend.DTOs;

namespace backend.Services.Interfaces;

public interface ICategoriaCargoService
{
    Task<CategoriaCargoResponseDto> CriarCargoAsync(CategoriaCargoCreateDto dto);
    Task<IEnumerable<CategoriaCargoResponseDto>> ListarCargosAsync();
    Task<CategoriaCargoResponseDto> ObterCargoPorIdAsync(long id);
    Task<CategoriaCargoResponseDto> AtualizarCargoAsync(long id, CategoriaCargoUpdateDto dto);
    Task<bool> DeletarCargoAsync(long id);
}