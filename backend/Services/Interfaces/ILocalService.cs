// Services/Interfaces/ILocalService.cs
using backend.DTOs;

namespace backend.Services.Interfaces;

public interface ILocalService
{
    Task<LocalResponseDto> CriarLocalAsync(LocalCreateDto dto);
    Task<IEnumerable<LocalResponseDto>> ListarLocaisAsync();
    Task<LocalResponseDto> ObterLocalPorIdAsync(long id);
    Task<LocalResponseDto> AtualizarLocalAsync(long id, LocalUpdateDto dto);
    Task DeletarLocalAsync(long id);
}