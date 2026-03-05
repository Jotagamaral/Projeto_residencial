using backend_novo.DTOs;
namespace backend_novo.Services.Interfaces;

public interface IUsuarioService
{
    Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto);
    Task<IEnumerable<UsuarioResponseDto>> ListarAtivosAsync();
}