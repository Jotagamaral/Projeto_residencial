using backend_novo.DTOs;

namespace backend_novo.Services.Interfaces;

public interface IEncomendaService
{
    Task<IEnumerable<EncomendaResponseDto>> ListarEncomendasAsync();
    Task<EncomendaResponseDto> CriarEncomendaAsync(EncomendaCreateDto dto, long funcionarioId);
    Task<EncomendaResponseDto> AtualizarEncomendaAsync(long id, EncomendaUpdateDto dto, long funcionarioId);
    Task CancelarEncomendaAsync(long id, long funcionarioId);
}