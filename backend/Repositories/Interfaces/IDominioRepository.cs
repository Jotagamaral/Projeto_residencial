using backend.Models;

namespace backend.Repositories.Interfaces;

public interface IDominioRepository
{
    Task<IEnumerable<CategoriaEncomenda>> ListarCategoriasEncomendaAsync();
    Task<IEnumerable<CategoriaReclamacao>> ListarCategoriasReclamacaoAsync();
    Task<IEnumerable<CategoriaReserva>> ListarCategoriasReservaAsync();
}