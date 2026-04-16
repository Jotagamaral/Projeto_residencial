using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IAvisoRepository
{
    Task<Aviso> AdicionarAsync(Aviso aviso);
    Task<IReadOnlyList<Aviso>> ListarAtivosNaoExpiradosAsync(DateTime referenciaUtc);
    Task<IReadOnlyList<Aviso>> ListarTodosAsync();
    Task<Aviso?> ObterPorIdTrackedAsync(long id);
}
