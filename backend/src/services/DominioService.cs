using backend.src.dtos.Dominio;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class DominioService : IDominioService
{
    private readonly IDominioRepository _dominioRepository;

    public DominioService(IDominioRepository dominioRepository)
    {
        _dominioRepository = dominioRepository;
    }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusEncomendaAsync()
    {
        var lista = await _dominioRepository.ListarCategoriasEncomendaAsync();
        return lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome)); 
    }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusReclamacaoAsync()
    {
        var lista = await _dominioRepository.ListarCategoriasReclamacaoAsync();
        return lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome));
    }

    public async Task<IEnumerable<CategoriaStatusDto>> ListarStatusReservaAsync()
    {
        var lista = await _dominioRepository.ListarCategoriasReservaAsync();
        return lista.Select(x => new CategoriaStatusDto(x.Id, x.Nome));
    }
}