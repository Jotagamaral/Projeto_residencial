using backend.Models;

namespace backend.Repositories.Interfaces;

public interface IAvisoRepository
{
    Task<Aviso> AdicionarAsync(Aviso aviso);
    Task<IReadOnlyList<Aviso>> ListarAtivosNaoExpiradosAsync(DateTime referenciaUtc);
    Task<IReadOnlyList<Aviso>> ListarTodosAsync();
    Task<Aviso?> ObterPorIdTrackedAsync(long id);
}
