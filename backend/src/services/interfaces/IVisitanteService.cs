using backend.src.dtos.Visitante;

namespace backend.src.services.interfaces;

public interface IVisitanteService
{
    Task<IEnumerable<VisitanteResponseDto>> ListarVisitantesAsync();
    Task<IEnumerable<VisitanteComAcessoDto>> ListarVisitantesComAcessoAsync();
    Task<AcessoVisitanteResponseDto> RegistrarEntradaAsync(RegistrarEntradaDto dto);
    Task<AcessoVisitanteResponseDto> RegistrarAcessoExistenteAsync(long idVisitante, RegistrarAcessoExistenteDto dto);
    Task<VisitanteResponseDto> AtualizarVisitanteAsync(long id, AtualizarVisitanteDto dto);
    Task<AcessoVisitanteResponseDto> RegistrarSaidaAsync(long idAcesso);
    Task InativarVisitanteAsync(long id);
    Task<IEnumerable<AcessoVisitanteResponseDto>> ListarAcessosAsync();
    Task<IEnumerable<AcessoVisitanteResponseDto>> ListarAcessosEmAbertoAsync();
    Task<AcessoVisitanteResponseDto> ObterAcessoPorIdAsync(long id);
}
