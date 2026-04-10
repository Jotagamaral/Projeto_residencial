using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IFuncionarioService
{
    Task<IEnumerable<FuncionarioResponseDto>> ListarFuncionariosAsync();
    Task<FuncionarioResponseDto> ObterFuncionarioPorIdAsync(long id);
    Task<FuncionarioResponseDto> AtualizarFuncionarioAsync(long id, FuncionarioUpdateDto dto);
    Task DeletarFuncionarioAsync(long id);
}