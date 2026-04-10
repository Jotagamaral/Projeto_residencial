using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IDominioRepository
{
    Task<IEnumerable<CategoriaEncomenda>> ListarCategoriasEncomendaAsync();
    Task<IEnumerable<CategoriaReclamacao>> ListarCategoriasReclamacaoAsync();
    Task<IEnumerable<CategoriaReserva>> ListarCategoriasReservaAsync();
}