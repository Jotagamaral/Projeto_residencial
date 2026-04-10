using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IMoradorService
{
    Task<IEnumerable<MoradorResponseDto>> ListarMoradoresAsync();
    Task<MoradorResponseDto> ObterMoradorPorIdAsync(long id);
    Task<MoradorResponseDto> AtualizarMoradorAsync(long id, MoradorUpdateDto dto);
    Task DeletarMoradorAsync(long id);
}