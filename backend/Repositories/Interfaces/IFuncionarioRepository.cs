using backend.Models;

namespace backend.Repositories.Interfaces;

public interface IFuncionarioRepository
{
    Task<Funcionario> AdicionarAsync(Funcionario funcionario);
    Task<Funcionario?> ObterPorIdUserAsync(long idUser);
    Task<bool> ExisteFuncionarioComCargoAsync(long cargoId);
    Task<Funcionario?> ObterPorIdAsync(long id);
    Task<IEnumerable<Funcionario>> ListarAtivosAsync();
    Task AtualizarAsync(Funcionario funcionario);
    Task SalvarAlteracoesAsync();
}