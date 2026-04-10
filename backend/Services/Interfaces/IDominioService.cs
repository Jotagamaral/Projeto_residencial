using backend.DTOs;

namespace backend.Services.Interfaces;

public interface IDominioService
{
    Task<IEnumerable<CategoriaStatusDto>> ListarStatusEncomendaAsync();
    Task<IEnumerable<CategoriaStatusDto>> ListarStatusReclamacaoAsync();
    Task<IEnumerable<CategoriaStatusDto>> ListarStatusReservaAsync();
}