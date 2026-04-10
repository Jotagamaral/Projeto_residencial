// Repositories/CategoriaCargoRepository.cs
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class CategoriaCargoRepository : ICategoriaCargoRepository
{
    private readonly AppDbContext _context;

    public CategoriaCargoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CategoriaCargo?> ObterPorIdAsync(long id)
    {
        return await _context.CategoriaCargo
            .FirstOrDefaultAsync(c => c.Id == id && c.Ativo);
    }

    public async Task<CategoriaCargo?> ObterPorNomeAsync(string nome)
    {
        return await _context.CategoriaCargo
            .FirstOrDefaultAsync(c => c.Nome.ToLower() == nome.ToLower());
    }

    public async Task<bool> VerificarNomeEmUsoAsync(string nome, long idIgnorado)
    {
        return await _context.CategoriaCargo
            .AnyAsync(c => c.Nome.ToLower() == nome.ToLower() && c.Id != idIgnorado);
    }

    public async Task<IEnumerable<CategoriaCargo>> ListarAtivosAsync()
    {
        return await _context.CategoriaCargo
            .Where(c => c.Ativo)
            .ToListAsync();
    }

    public async Task AdicionarAsync(CategoriaCargo categoria)
    {
        await _context.CategoriaCargo.AddAsync(categoria);
    }

    public async Task AtualizarAsync(CategoriaCargo categoria)
    {
        _context.CategoriaCargo.Update(categoria);
    }
}