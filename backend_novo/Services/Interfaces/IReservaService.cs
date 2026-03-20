using backend_novo.DTOs;
namespace backend_novo.Services.Interfaces;

public interface IReservaService
{
    Task<ReservaResponseDto> CriarReservaAsync(ReservaCreateDto dto);
    Task<IEnumerable<ReservaResponseDto>> ListarReservasAsync();
}