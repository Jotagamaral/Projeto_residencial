using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IEncomendaService
{
    Task<IEnumerable<EncomendaResponseDto>> ListarEncomendasAsync();
    Task<IEnumerable<EncomendaResponseDto>> ListarMinhasEncomendasAsync(long userId);
    Task<EncomendaResponseDto> CriarEncomendaAsync(EncomendaCreateDto dto, long funcionarioId);
    Task<EncomendaResponseDto> AtualizarEncomendaAsync(long id, EncomendaUpdateDto dto, long funcionarioId);
    Task<EncomendaResponseDto> AtualizarRetiradaAsync(long id, bool retirada, long funcionarioId);
    Task CancelarEncomendaAsync(long id, long funcionarioId);
}