using backend_novo.Models;

namespace backend_novo.Repositories.Interfaces;

public interface IEncomendaRepository
{
    Task<Encomenda> AdicionarAsync(Encomenda encomenda);
    Task<IEnumerable<Encomenda>> ListarAtivasAsync();
}
