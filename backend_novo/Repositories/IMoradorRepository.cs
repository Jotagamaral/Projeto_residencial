using backend_novo.Models;

namespace backend_novo.Repositories;

public interface IMoradorRepository
{
    Task<Morador?> GetByCpfAsync(string cpf);
}
