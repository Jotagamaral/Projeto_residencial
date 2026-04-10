using backend.src.dtos.Morador;

namespace backend.src.services.interfaces;

public interface IMoradorService
{
    Task<IEnumerable<MoradorResponseDto>> ListarMoradoresAsync();
    Task<MoradorResponseDto> ObterMoradorPorIdAsync(long id);
    Task<MoradorResponseDto> AtualizarMoradorAsync(long id, MoradorUpdateDto dto);
    Task DeletarMoradorAsync(long id);
}