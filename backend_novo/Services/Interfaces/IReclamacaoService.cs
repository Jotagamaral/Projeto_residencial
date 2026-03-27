// Services/Interfaces/IReclamacaoService.cs
using backend_novo.DTOs;

namespace backend_novo.Services.Interfaces;

public interface IReclamacaoService
{
    // Leitura
    Task<IEnumerable<ReclamacaoResponseDto>> ListarMinhasReclamacoesAsync(long userId);
    Task<IEnumerable<ReclamacaoResponseDto>> ListarTodasReclamacoesAsync();
    Task<IEnumerable<ReclamacaoPublicaDto>> ListarTodasReclamacoesPublicasAsync();
    
    // Escrita (Morador)
    Task<ReclamacaoResponseDto> CriarReclamacaoAsync(ReclamacaoCreateDto dto, long userId);
    Task<ReclamacaoResponseDto> AtualizarReclamacaoAsync(long id, long userId, ReclamacaoUpdateDto dto);
    Task CancelarReclamacaoAsync(long id, long userId);

    // Escrita (Admin)
    Task<ReclamacaoResponseDto> AtualizarReclamacaoAdminAsync(long id, long adminId, ReclamacaoAdminUpdateDto dto);
    Task CancelarReclamacaoAdminAsync(long id, long adminId);
}