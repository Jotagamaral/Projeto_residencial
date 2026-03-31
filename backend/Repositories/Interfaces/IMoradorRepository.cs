using backend.Models;
namespace backend.Repositories.Interfaces;
public interface IMoradorRepository
{
    Task<Morador> AdicionarAsync(Morador morador);
    Task<Morador?> ObterPorIdUserAsync(long idUser);
}

