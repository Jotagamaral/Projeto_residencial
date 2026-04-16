using backend.src.dtos.Aviso;

namespace backend.src.services.interfaces;

public interface IAvisoService
{
    Task<AvisoResponseDto> CriarAsync(AvisoCreateDto dto, long idUsuario);
    Task<IReadOnlyList<AvisoResponseDto>> ListarAtivosAsync();
    Task<IReadOnlyList<AvisoResponseDto>> ListarTodosGestaoAsync();
    Task<AvisoResponseDto> AtualizarAsync(long id, AvisoUpdateDto dto);
    Task<AvisoResponseDto> DefinirAtivoAsync(long id, bool ativo);
}
