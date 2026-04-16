using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> getByCpfAsync (string cpf);
    Task<IEnumerable<Usuario>> ListarTodosAsync ();
    Task<Usuario> AdicionarAsync (Usuario usuario);
    Task<Usuario> AtualizarAsync (Usuario usuario);
    Task DeletarAsync (long id);
}