using backend_novo.Models;

namespace backend_novo.Repositories;

public interface IFuncionarioRepository
{
    Task<Funcionario?> GetByCpfAsync(string cpf);
}
