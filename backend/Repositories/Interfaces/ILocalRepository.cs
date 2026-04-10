// Repositories/Interfaces/ILocalRepository.cs
using backend.Models;

namespace backend.Repositories.Interfaces;

public interface ILocalRepository
{
    Task<Local?> ObterPorIdAsync(long id);
    Task<Local?> ObterPorNomeAsync(string nome);
    Task<bool> VerificarNomeEmUsoAsync(string nome, long idIgnorado);
    Task<bool> PossuiReservasFuturasAsync(long idLocal);
    Task<IEnumerable<Local>> ListarAtivosAsync();
    Task AdicionarAsync(Local local);
    Task AtualizarAsync(Local local);
    Task SalvarAlteracoesAsync();
}