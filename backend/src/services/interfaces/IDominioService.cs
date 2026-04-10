using backend.src.dtos.Dominio;

namespace backend.src.services.interfaces;

public interface IDominioService
{
    Task<IEnumerable<CategoriaStatusDto>> ListarStatusEncomendaAsync();
    Task<IEnumerable<CategoriaStatusDto>> ListarStatusReclamacaoAsync();
    Task<IEnumerable<CategoriaStatusDto>> ListarStatusReservaAsync();
}