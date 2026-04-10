using backend.Models;

namespace backend.Repositories.Interfaces;

public interface IMoradorRepository
{
    Task<Morador?> ObterPorIdUserAsync(long userId);
    Task<Morador?> ObterPorIdAsync(long id);
    Task<IEnumerable<Morador>> ListarAtivosAsync();
    Task AdicionarAsync(Morador morador);
    Task AtualizarAsync(Morador morador);
    Task SalvarAlteracoesAsync();
}