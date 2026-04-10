using backend.src.dtos.Funcionario;
using backend.src.exceptions;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class FuncionarioService : IFuncionarioService
{
    private readonly IFuncionarioRepository _funcionarioRepository;
    private readonly ICategoriaCargoRepository _categoriaCargoRepository;

    public FuncionarioService(
        IFuncionarioRepository funcionarioRepository,
        ICategoriaCargoRepository categoriaCargoRepository)
    {
        _funcionarioRepository = funcionarioRepository;
        _categoriaCargoRepository = categoriaCargoRepository;
    }

    public async Task<IEnumerable<FuncionarioResponseDto>> ListarFuncionariosAsync()
    {
        var funcionarios = await _funcionarioRepository.ListarAtivosAsync();
        
        return funcionarios.Select(f => new FuncionarioResponseDto
        {
            Id = f.Id,
            Nome = f.Usuario?.Nome,
            Email = f.Usuario?.Email,
            Cpf = f.Usuario?.Cpf,
            CargoId = f.IdCategoriaCargo,
            CargoNome = f.CategoriaCargo?.Nome
        });
    }

    public async Task<FuncionarioResponseDto> ObterFuncionarioPorIdAsync(long id)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdAsync(id);
        if (funcionario == null)
            throw new NotFoundException("Funcionário não encontrado.");

        return new FuncionarioResponseDto
        {
            Id = funcionario.Id,
            Nome = funcionario.Usuario?.Nome,
            Email = funcionario.Usuario?.Email,
            Cpf = funcionario.Usuario?.Cpf,
            CargoId = funcionario.IdCategoriaCargo,
            CargoNome = funcionario.CategoriaCargo?.Nome
        };
    }

    public async Task<FuncionarioResponseDto> AtualizarFuncionarioAsync(long id, FuncionarioUpdateDto dto)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdAsync(id);
        if (funcionario == null)
            throw new NotFoundException("Funcionário não encontrado.");

        // Regra de Negócio: Verifica se o novo cargo existe e está ativo
        var novoCargo = await _categoriaCargoRepository.ObterPorIdAsync(dto.CargoId);
        if (novoCargo == null)
            throw new BusinessRuleException("A categoria de cargo informada não existe ou está inativa.");

        // Atualiza a FK
        funcionario.IdCategoriaCargo = dto.CargoId;

        await _funcionarioRepository.AtualizarAsync(funcionario);
        await _funcionarioRepository.SalvarAlteracoesAsync();

        return new FuncionarioResponseDto
        {
            Id = funcionario.Id,
            Nome = funcionario.Usuario?.Nome,
            Email = funcionario.Usuario?.Email,
            Cpf = funcionario.Usuario?.Cpf,
            CargoId = novoCargo.Id,
            CargoNome = novoCargo.Nome
        };
    }

    public async Task DeletarFuncionarioAsync(long id)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdAsync(id);
        if (funcionario == null)
            throw new NotFoundException("Funcionário não encontrado.");

        funcionario.Ativo = false;
        
        await _funcionarioRepository.AtualizarAsync(funcionario);
        await _funcionarioRepository.SalvarAlteracoesAsync();
    }
}