// services/DominioService.cs
using backend.src.dtos.Dominio;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class DominioService : IDominioService
{
    private readonly IDominioRepository _dominioRepository;
    private readonly ICacheService _cacheService;

    // Nomenclatura hierárquica (namespaces) orientada a domínios
    private const string CACHE_KEY_STATUS_ENCOMENDA = "dominio:status:encomenda";
    private const string CACHE_KEY_STATUS_RECLAMACAO = "dominio:status:reclamacao";
    private const string CACHE_KEY_STATUS_RESERVA = "dominio:status:reserva";

    public DominioService(IDominioRepository dominioRepository, ICacheService cacheService)
    {
        _dominioRepository = dominioRepository;
        _cacheService = cacheService;
    }

    // ---------------- Lógica de Invalidação ----------------

    // private async Task InvalidarCachesAfetadosAsync(string CACHE_KEY)
    // {
    //     await _cacheService.RemoveAsync(CACHE_KEY);
    // }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusEncomendaAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<CategoriaStatusDto>>(CACHE_KEY_STATUS_ENCOMENDA);
        if (cachedData != null) return cachedData;

        var lista = await _dominioRepository.ListarCategoriasEncomendaAsync();
        var resultado = lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome)).ToList();

        // Domínios de status raramente mudam, o TTL pode ser longo com segurança
        await _cacheService.SetAsync(CACHE_KEY_STATUS_ENCOMENDA, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusReclamacaoAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<CategoriaStatusDto>>(CACHE_KEY_STATUS_RECLAMACAO);
        if (cachedData != null) return cachedData;

        var lista = await _dominioRepository.ListarCategoriasReclamacaoAsync();
        var resultado = lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome)).ToList();

        await _cacheService.SetAsync(CACHE_KEY_STATUS_RECLAMACAO, resultado, TimeSpan.FromHours(24));
        
        return resultado;
    }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusReservaAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<CategoriaStatusDto>>(CACHE_KEY_STATUS_RESERVA);
        if (cachedData != null) return cachedData;

        var lista = await _dominioRepository.ListarCategoriasReservaAsync();
        var resultado = lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome)).ToList();

        await _cacheService.SetAsync(CACHE_KEY_STATUS_RESERVA, resultado, TimeSpan.FromHours(24));
        
        return resultado;
    }
}