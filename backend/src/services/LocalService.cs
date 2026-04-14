// Services/LocalService.cs
using backend.src.dtos.Local;
using backend.src.exceptions;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class LocalService : ILocalService
{
    private readonly ILocalRepository _localRepository;
    private readonly ICacheService _cacheService;

    // Chaves de identificação estruturadas
    private const string CACHE_KEY_TODOS_LOCAIS = "locais:ativos:todos";
    private static string ObterChaveCacheLocal(long id) => $"locais:detalhe:{id}";

    public LocalService(
        ILocalRepository localRepository,
        ICacheService cacheService)
    {
        _localRepository = localRepository;
        _cacheService = cacheService;
    }

    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync(long? idLocal = null)
    {
        await _cacheService.RemoveAsync(CACHE_KEY_TODOS_LOCAIS);
        
        if (idLocal.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheLocal(idLocal.Value));
        }
    }

    // ---------------- Lógica de Criação ----------------

    public async Task<LocalResponseDto> CriarLocalAsync(LocalCreateDto dto)
    {
        var nomeFormatado = dto.Nome.Trim();

        var localExistente = await _localRepository.ObterPorNomeAsync(nomeFormatado);
        if (localExistente != null)
            throw new BusinessRuleException("Já existe um local cadastrado com este nome.");

        var novoLocal = new Local
        {
            Nome = nomeFormatado,
            Capacidade = dto.Capacidade,
            Ativo = true
        };

        await _localRepository.AdicionarAsync(novoLocal);
        await _localRepository.SalvarAlteracoesAsync();

        // Invalida apenas a lista global
        await InvalidarCachesAfetadosAsync();

        return new LocalResponseDto { Id = novoLocal.Id, Nome = novoLocal.Nome, Capacidade = novoLocal.Capacidade };
    }

    // ---------------- Lógica de Leitura ----------------

    public async Task<IEnumerable<LocalResponseDto>> ListarLocaisAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<LocalResponseDto>>(CACHE_KEY_TODOS_LOCAIS);
        if (cachedData != null) return cachedData;

        var locais = await _localRepository.ListarAtivosAsync();
        var resultado = locais.Select(l => new LocalResponseDto 
        { 
            Id = l.Id, 
            Nome = l.Nome, 
            Capacidade = l.Capacidade 
        }).ToList();

        // Alta retenção
        await _cacheService.SetAsync(CACHE_KEY_TODOS_LOCAIS, resultado, TimeSpan.FromDays(7));

        return resultado;
    }

    public async Task<LocalResponseDto> ObterLocalPorIdAsync(long id)
    {
        var cacheKey = ObterChaveCacheLocal(id);
        var cachedData = await _cacheService.GetAsync<LocalResponseDto>(cacheKey);
        if (cachedData != null) return cachedData;

        var local = await _localRepository.ObterPorIdAsync(id);
        
        if (local == null)
            throw new NotFoundException("Local não encontrado.");

        var resultado = new LocalResponseDto 
        { 
            Id = local.Id, 
            Nome = local.Nome, 
            Capacidade = local.Capacidade 
        };

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromDays(7));

        return resultado;
    }

    // ---------------- Lógica de Mutação (Update/Delete) ----------------

    public async Task<LocalResponseDto> AtualizarLocalAsync(long id, LocalUpdateDto dto)
    {
        var local = await _localRepository.ObterPorIdAsync(id);
        if (local == null)
            throw new NotFoundException("Local não encontrado.");

        var nomeFormatado = dto.Nome.Trim();
        var nomeEmUso = await _localRepository.VerificarNomeEmUsoAsync(nomeFormatado, id);
        
        if (nomeEmUso)
            throw new BusinessRuleException("Já existe outro local utilizando este nome.");

        local.Nome = nomeFormatado;
        local.Capacidade = dto.Capacidade;

        await _localRepository.AtualizarAsync(local);
        await _localRepository.SalvarAlteracoesAsync();

        // Limpa a lista
        await InvalidarCachesAfetadosAsync(id);

        return new LocalResponseDto { Id = local.Id, Nome = local.Nome, Capacidade = local.Capacidade };
    }

    public async Task DeletarLocalAsync(long id)
    {
        var local = await _localRepository.ObterPorIdAsync(id);
        if (local == null)
            throw new NotFoundException("Local não encontrado.");

        var possuiReservas = await _localRepository.PossuiReservasFuturasAsync(id);
        if (possuiReservas)
            throw new BusinessRuleException("Não é possível excluir este local, pois existem reservas futuras ativas para ele.");

        local.Ativo = false;
        
        await _localRepository.AtualizarAsync(local);
        await _localRepository.SalvarAlteracoesAsync();

        // Remove os rastros do local recém-excluído da memória
        await InvalidarCachesAfetadosAsync(id);
    }
}