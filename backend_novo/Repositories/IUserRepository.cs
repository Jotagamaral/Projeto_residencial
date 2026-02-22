using backend_novo.Models;

namespace backend_novo.Repositories;

public interface IUserRepository
{
    Task<User?> GetByCpfAsync(string cpf);
}
