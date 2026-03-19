using backend_novo.Models;
namespace backend_novo.Repositories.Interfaces;
public interface IMoradorRepository
{
    Task<Morador> AdicionarAsync(Morador morador);
    Task<Morador?> ObterPorIdUserAsync(long idUser);
}

