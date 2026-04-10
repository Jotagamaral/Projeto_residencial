using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IEncomendaRepository
{
    Task<Encomenda> AdicionarAsync(Encomenda encomenda);
    Task<IEnumerable<Encomenda>> ListarAtivasAsync();
    Task<IEnumerable<Encomenda>> ListarPorMoradorAsync(long moradorId);
    Task<Encomenda?> ObterPorIdAsync(long id);
    Task AtualizarAsync(Encomenda encomenda);
    Task DeletarAsync(Encomenda encomenda);
}