using backend.DTOs;
namespace backend.Services.Interfaces;

public interface IUsuarioService
{
    Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto);
    Task<IEnumerable<UsuarioResponseDto>> ListarAtivosAsync();
}