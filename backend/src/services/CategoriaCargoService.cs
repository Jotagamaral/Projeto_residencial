// Services/CategoriaCargoService.cs
using backend.src.dtos.CategoriaCargo;
using backend.src.exceptions;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class CategoriaCargoService(
    ICategoriaCargoRepository _categoriaCargoRepository,
    IFuncionarioRepository _funcionarioRepository,
    ICacheService _cacheService) : ICategoriaCargoService
{
    // Chaves de identificação estruturadas para o cache
    private const string CACHE_KEY_TODOS_CARGOS = "categoria_cargo:ativas:todas";
    private string ObterChaveCacheCargo(long id) => $"categoria_cargo:detalhe:{id}";

    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync(long? idCargo = null)
    {
        await _cacheService.RemoveAsync(CACHE_KEY_TODOS_CARGOS);

        if (idCargo.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheCargo(idCargo.Value));
        }
    }

    // --------------------------- CREATE ---------------------------

    public async Task<CategoriaCargoResponseDto> CriarCargoAsync(CategoriaCargoCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            throw new BusinessRuleException("O nome da categoria de cargo é obrigatório.");

        var nomeFormatado = dto.Nome.Trim();

        var cargoExistente = await _categoriaCargoRepository.ObterPorNomeAsync(nomeFormatado);

        if (cargoExistente != null)
            throw new BusinessRuleException("Já existe uma categoria de cargo com este nome.");

        var novoCargo = new CategoriaCargo
        {
            Nome = nomeFormatado,
            Ativo = true
        };

        await _categoriaCargoRepository.AdicionarAsync(novoCargo);

        // Invalida apenas a lista global
        await InvalidarCachesAfetadosAsync();

        return new CategoriaCargoResponseDto { Id = novoCargo.Id, Nome = novoCargo.Nome };
    }

    // --------------------------- READ ---------------------------

    public async Task<IEnumerable<CategoriaCargoResponseDto>> ListarCargosAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<CategoriaCargoResponseDto>>(CACHE_KEY_TODOS_CARGOS);
        if (cachedData != null) return cachedData;

        var cargos = await _categoriaCargoRepository.ListarAtivosAsync();
        
        var resultado = cargos.Select(c => new CategoriaCargoResponseDto 
        { 
            Id = c.Id, 
            Nome = c.Nome 
        }).ToList();

        await _cacheService.SetAsync(CACHE_KEY_TODOS_CARGOS, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    public async Task<CategoriaCargoResponseDto> ObterCargoPorIdAsync(long id)
    {
        var cacheKey = ObterChaveCacheCargo(id);
        var cachedData = await _cacheService.GetAsync<CategoriaCargoResponseDto>(cacheKey);
        if (cachedData != null) return cachedData;

        var cargo = await _categoriaCargoRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Categoria de cargo não encontrada.");

        var resultado = new CategoriaCargoResponseDto { Id = cargo.Id, Nome = cargo.Nome };

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    // --------------------------- UPDATE ---------------------------

    public async Task<CategoriaCargoResponseDto> AtualizarCargoAsync(long id, CategoriaCargoUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            throw new BusinessRuleException("O nome da categoria de cargo é obrigatório.");

        var nomeFormatado = dto.Nome.Trim();

        var cargo = await _categoriaCargoRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Categoria de cargo não encontrada.");

        var nomeEmUso = await _categoriaCargoRepository.VerificarNomeEmUsoAsync(nomeFormatado, id);

        if (nomeEmUso)
            throw new BusinessRuleException("Já existe outra categoria de cargo utilizando este nome.");

        cargo.Nome = nomeFormatado;

        await _categoriaCargoRepository.AtualizarAsync(cargo);

        // Limpa os dados obsoletos
        await InvalidarCachesAfetadosAsync(id);

        return new CategoriaCargoResponseDto { Id = cargo.Id, Nome = cargo.Nome };
    }

    // --------------------------- DELETE ---------------------------

    public async Task<bool> DeletarCargoAsync(long id)
    {
        var cargo = await _categoriaCargoRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Categoria de cargo não encontrada.");

        var possuiFuncionariosVinculados = await _funcionarioRepository.ExisteFuncionarioComCargoAsync(id);

        if (possuiFuncionariosVinculados)
            throw new BusinessRuleException("Não é possível excluir esta categoria pois existem funcionários ativos vinculados a ela.");

        cargo.Ativo = false;
        
        await _categoriaCargoRepository.AtualizarAsync(cargo);

        // Limpa os dados obsoletos
        await InvalidarCachesAfetadosAsync(id);

        return true;
    }
}