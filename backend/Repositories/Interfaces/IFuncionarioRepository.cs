using backend.Models;
namespace backend.Repositories.Interfaces;

public interface IFuncionarioRepository
{
    Task<Funcionario> AdicionarAsync(Funcionario funcionario);
    Task<Funcionario?> ObterPorIdUserAsync(long idUser);
}