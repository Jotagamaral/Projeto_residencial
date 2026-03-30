using backend_novo.DTOs;
namespace backend_novo.Services.Interfaces;

public interface IReservaService
{
    Task<ReservaResponseDto> CriarReservaAsync(ReservaCreateDto dto);
    Task<ReservaResponseDto> CriarReservaAdminAsync(ReservaAdminCreateDto dto, long adminIdLogado);
    Task<IEnumerable<ReservaResponseDto>> ListarReservasAsync();
    Task<IEnumerable<ReservaResponseDto>> ListarMinhasReservasAsync(long userIdLogado);
    Task<IEnumerable<ReservaCalendarioDto>> ListarOcupacoesAsync();
    Task<ReservaResponseDto> AtualizarReservaAsync(long reservaId, long userIdLogado, ReservaUpdateDto dto);
    Task<ReservaResponseDto> AtualizarReservaAdminAsync(long reservaId, long adminIdLogado, ReservaAdminUpdateDto dto);
    Task CancelarReservaAsync(long reservaId, long userIdLogado);
    Task CancelarReservaAdminAsync(long reservaId, long adminIdLogado);
}