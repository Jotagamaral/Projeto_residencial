using backend_novo.Models;
namespace backend_novo.Repositories.Interfaces;

public interface IFuncionarioRepository
{
    Task<Funcionario> AdicionarAsync(Funcionario funcionario);
}