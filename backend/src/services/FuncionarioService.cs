using backend.src.dtos.Funcionario;
using backend.src.exceptions;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class FuncionarioService : IFuncionarioService
{
    private readonly IFuncionarioRepository _funcionarioRepository;
    private readonly ICategoriaCargoRepository _categoriaCargoRepository;
    private readonly ICacheService _cacheService;

    // Chaves de identificação para o armazenamento
    private const string CACHE_KEY_TODOS_FUNCIONARIOS = "funcionarios:ativos:todos";
    private static string ObterChaveCacheFuncionario(long id) => $"funcionarios:detalhe:{id}";

    public FuncionarioService(
        IFuncionarioRepository funcionarioRepository,
        ICategoriaCargoRepository categoriaCargoRepository,
        ICacheService cacheService)
    {
        _funcionarioRepository = funcionarioRepository;
        _categoriaCargoRepository = categoriaCargoRepository;
        _cacheService = cacheService;
    }

    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync(long? idFuncionario = null)
    {
        await _cacheService.RemoveAsync(CACHE_KEY_TODOS_FUNCIONARIOS);
        
        if (idFuncionario.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheFuncionario(idFuncionario.Value));
        }
    }

    // ---------------- Lógica de Leitura ----------------

    public async Task<IEnumerable<FuncionarioResponseDto>> ListarFuncionariosAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<FuncionarioResponseDto>>(CACHE_KEY_TODOS_FUNCIONARIOS);
        if (cachedData != null) return cachedData;

        var funcionarios = await _funcionarioRepository.ListarAtivosAsync();
        
        var resultado = funcionarios.Select(f => new FuncionarioResponseDto
        {
            Id = f.Id,
            Nome = f.Usuario?.Nome,
            Email = f.Usuario?.Email,
            Cpf = f.Usuario?.Cpf,
            CargoId = f.IdCategoriaCargo,
            CargoNome = f.CategoriaCargo?.Nome
        }).ToList();

        // Tempo de retenção longo
        await _cacheService.SetAsync(CACHE_KEY_TODOS_FUNCIONARIOS, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    public async Task<FuncionarioResponseDto> ObterFuncionarioPorIdAsync(long id)
    {
        var cacheKey = ObterChaveCacheFuncionario(id);
        var cachedData = await _cacheService.GetAsync<FuncionarioResponseDto>(cacheKey);
        if (cachedData != null) return cachedData;

        var funcionario = await _funcionarioRepository.ObterPorIdAsync(id);
        if (funcionario == null)
            throw new NotFoundException("Funcionário não encontrado.");

        var resultado = new FuncionarioResponseDto
        {
            Id = funcionario.Id,
            Nome = funcionario.Usuario?.Nome,
            Email = funcionario.Usuario?.Email,
            Cpf = funcionario.Usuario?.Cpf,
            CargoId = funcionario.IdCategoriaCargo,
            CargoNome = funcionario.CategoriaCargo?.Nome
        };

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    // ---------------- Lógica de Mutação ----------------

    public async Task<FuncionarioResponseDto> AtualizarFuncionarioAsync(long id, FuncionarioUpdateDto dto)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdAsync(id);
        if (funcionario == null)
            throw new NotFoundException("Funcionário não encontrado.");

        var novoCargo = await _categoriaCargoRepository.ObterPorIdAsync(dto.CargoId);
        if (novoCargo == null)
            throw new BusinessRuleException("A categoria de cargo informada não existe ou está inativa.");

        // Atualiza a FK
        funcionario.IdCategoriaCargo = dto.CargoId;

        await _funcionarioRepository.AtualizarAsync(funcionario);
        await _funcionarioRepository.SalvarAlteracoesAsync();

        // Invalida os dados obsoletos
        await InvalidarCachesAfetadosAsync(id);

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

        // Invalida os dados obsoletos
        await InvalidarCachesAfetadosAsync(id);
    }
}