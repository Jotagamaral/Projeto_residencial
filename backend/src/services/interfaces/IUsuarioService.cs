using backend.src.dtos.Usuario;
namespace backend.src.services.interfaces;

public interface IUsuarioService
{
    Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto);
    Task<IEnumerable<UsuarioResponseDto>> ListarAtivosAsync();
    Task<UsuarioResponseDto> ObterPerfilAdminPorUserIdAsync(long userId);
    Task<UsuarioResponseDto> AtualizarDadosPessoaisAdminAsync(long userId, backend.src.dtos.Funcionario.FuncionarioUpdateDadosPessoaisDto dto);
    Task AlterarSenhaAdminAsync(long userId, backend.src.dtos.Funcionario.FuncionarioAlterarSenhaDto dto);
}