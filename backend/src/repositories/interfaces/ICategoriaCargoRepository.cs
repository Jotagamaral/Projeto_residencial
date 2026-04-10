// Repositories/Interfaces/ICategoriaCargoRepository.cs
using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface ICategoriaCargoRepository
{
    Task<CategoriaCargo?> ObterPorIdAsync(long id);
    Task<CategoriaCargo?> ObterPorNomeAsync(string nome);
    Task<bool> VerificarNomeEmUsoAsync(string nome, long idIgnorado);
    Task<IEnumerable<CategoriaCargo>> ListarAtivosAsync();
    Task AdicionarAsync(CategoriaCargo categoria);
    Task AtualizarAsync(CategoriaCargo categoria);
}