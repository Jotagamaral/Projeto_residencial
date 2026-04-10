using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class MoradorRepository : IMoradorRepository
{
    private readonly AppDbContext _context;

    public MoradorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Morador?> ObterPorIdUserAsync(long userId)
    {
        return await _context.Moradores
            .Include(m => m.Usuario)
            .FirstOrDefaultAsync(m => m.IdUser == userId && m.Ativo);
    }

    public async Task<Morador?> ObterPorIdAsync(long id)
    {
        return await _context.Moradores
            .Include(m => m.Usuario)
            .FirstOrDefaultAsync(m => m.Id == id && m.Ativo);
    }

    public async Task<IEnumerable<Morador>> ListarAtivosAsync()
    {
        return await _context.Moradores
            .Include(m => m.Usuario)
            .Where(m => m.Ativo && m.Usuario!.Ativo) // Garante que o usuário base também está ativo
            .ToListAsync();
    }

    public async Task AdicionarAsync(Morador morador)
    {
        await _context.Moradores.AddAsync(morador);
    }

    public async Task AtualizarAsync(Morador morador)
    {
        _context.Moradores.Update(morador);
    }

    public async Task SalvarAlteracoesAsync()
    {
        await _context.SaveChangesAsync();
    }
}