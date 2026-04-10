// Services/Interfaces/ICategoriaCargoService.cs
using backend.src.dtos.CategoriaCargo;

namespace backend.src.services.interfaces;

public interface ICategoriaCargoService
{
    Task<CategoriaCargoResponseDto> CriarCargoAsync(CategoriaCargoCreateDto dto);
    Task<IEnumerable<CategoriaCargoResponseDto>> ListarCargosAsync();
    Task<CategoriaCargoResponseDto> ObterCargoPorIdAsync(long id);
    Task<CategoriaCargoResponseDto> AtualizarCargoAsync(long id, CategoriaCargoUpdateDto dto);
    Task<bool> DeletarCargoAsync(long id);
}