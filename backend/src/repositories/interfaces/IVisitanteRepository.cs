using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IVisitanteRepository
{
    Task<IEnumerable<Visitante>> ListarTodosAsync();
    Task<IEnumerable<(Visitante, AcessoVisitante?)>> ListarAtivosComUltimoAcessoAsync();
    Task<Visitante?> ObterPorCpfAsync(string cpf);
    Task<Visitante?> ObterPorIdAsync(long id);
    Task<int> InativarPorIdAsync(long id);
    Task AdicionarAsync(Visitante visitante);
    Task AtualizarAsync(Visitante visitante);
    Task SalvarAlteracoesAsync();
}
