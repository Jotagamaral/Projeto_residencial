using backend_novo.DTOs;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using backend_novo.Services.Interfaces;

namespace backend_novo.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _repository;

    public UsuarioService(IUsuarioRepository repository)
    {
        _repository = repository;
    }

    public async Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto)
    {
        // Verificar se o CPF já está cadastrado
        var usuarioExistente = await _repository.getByCpfAsync(dto.Cpf);
        if (usuarioExistente != null)
            throw new Exception("Este CPF já está em uso.");

        // Mapeamento: DTO -> Model
        var novoUsuario = new Usuario
        {
            Nome = dto.Nome,
            Cpf = dto.Cpf,
            Email = dto.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha), // Hash senha
            CategoriaAcessoId = dto.CategoriaAcessoId,
            Ativo = true
        };

        // Persistência
        var usuarioSalvo = await _repository.AdicionarAsync(novoUsuario);

        // Retorno: Model -> DTO
        return new UsuarioResponseDto 
        { 
            Id = usuarioSalvo.Id, 
            Nome = usuarioSalvo.Nome, 
            Email = usuarioSalvo.Email 
        };
    }

    public async Task<IEnumerable<UsuarioResponseDto>> ListarAtivosAsync()
    {
        // Por enquanto, apenas para compilar, vamos retornar uma lista vazia ou erro
        // Depois você implementa a lógica real com o repositório
        var usuarios = await _repository.ListarTodosAsync();
        return usuarios.Where(u => u.Ativo).Select(u => new UsuarioResponseDto 
        {
            Id = u.Id,
            Nome = u.Nome,
            Email = u.Email
        });
    }

    
}