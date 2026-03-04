using backend_novo.Models;
namespace backend_novo.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> getByCpfAsync (string cpf);
    Task<IEnumerable<Usuario>> ListarTodosAsync ();
    Task<Usuario> AdicionarAsync (Usuario usuario);
    Task<Usuario> AtualizarAsync (Usuario usuario);
    Task DeletarAsync (long id);
}