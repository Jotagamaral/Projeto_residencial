using backend.src.context;
using backend.src.models;
using backend.src.repositories.interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.repositories;

public class DominioRepository : IDominioRepository
{
    private readonly AppDbContext _context;

    public DominioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoriaEncomenda>> ListarCategoriasEncomendaAsync()
    {
        return await _context.CategoriasEncomenda.ToListAsync();
    }

    public async Task<IEnumerable<CategoriaReclamacao>> ListarCategoriasReclamacaoAsync()
    {
        return await _context.CategoriasReclamacao.ToListAsync();
    }

    public async Task<IEnumerable<CategoriaReserva>> ListarCategoriasReservaAsync()
    {
        return await _context.CategoriasReserva.ToListAsync();
    }
}