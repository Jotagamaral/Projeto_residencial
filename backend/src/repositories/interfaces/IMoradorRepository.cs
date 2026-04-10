using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IMoradorRepository
{
    Task<Morador?> ObterPorIdUserAsync(long userId);
    Task<Morador?> ObterPorIdAsync(long id);
    Task<IEnumerable<Morador>> ListarAtivosAsync();
    Task AdicionarAsync(Morador morador);
    Task AtualizarAsync(Morador morador);
    Task SalvarAlteracoesAsync();
}