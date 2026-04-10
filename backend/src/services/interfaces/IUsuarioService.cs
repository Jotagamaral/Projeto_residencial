using backend.src.dtos.Usuario;
namespace backend.src.services.interfaces;

public interface IUsuarioService
{
    Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto);
    Task<IEnumerable<UsuarioResponseDto>> ListarAtivosAsync();
}