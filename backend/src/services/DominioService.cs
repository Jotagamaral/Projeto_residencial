// services/DominioService.cs
using backend.src.dtos.Dominio;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class DominioService : IDominioService
{
    private readonly IDominioRepository _dominioRepository;
    private readonly ICacheService _cacheService;

    private const string CACHE_KEY_STATUS_ENCOMENDA = "dominios_status_encomenda";
    private const string CACHE_KEY_STATUS_RECLAMACAO = "dominios_status_reclamacao";
    private const string CACHE_KEY_STATUS_RESERVA = "dominios_status_reserva";

    public DominioService(IDominioRepository dominioRepository, ICacheService cacheService)
    {
        _dominioRepository = dominioRepository;
        _cacheService = cacheService;
    }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusEncomendaAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<CategoriaStatusDto>>(CACHE_KEY_STATUS_ENCOMENDA);
        if (cachedData != null) return cachedData;

        var lista = await _dominioRepository.ListarCategoriasEncomendaAsync();
        var resultado = lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome)).ToList();

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