using backend_novo.DTOs;

namespace backend_novo.Services.Interfaces;

public interface IEncomendaService
{
    Task<EncomendaResponseDto> CriarEncomendaAsync(EncomendaCreateDto dto);
    Task<IEnumerable<EncomendaResponseDto>> ListarEncomendasAsync();
}
