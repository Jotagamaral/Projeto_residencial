using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IAcessoVisitanteRepository
{
    Task<AcessoVisitante?> ObterPorIdAsync(long id);
    Task<IEnumerable<AcessoVisitante>> ListarTodosAsync();
    Task<IEnumerable<AcessoVisitante>> ListarAcessosEmAbertoAsync();
    Task AdicionarAsync(AcessoVisitante acesso);
    Task AtualizarAsync(AcessoVisitante acesso);
    Task SalvarAlteracoesAsync();
}
