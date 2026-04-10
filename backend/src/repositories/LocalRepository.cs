// Repositories/LocalRepository.cs
using backend.src.context;
using backend.src.models;
using backend.src.repositories.interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.repositories;

public class LocalRepository : ILocalRepository
{
    private readonly AppDbContext _context;

    public LocalRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Local?> ObterPorIdAsync(long id)
    {
        return await _context.Locais.FirstOrDefaultAsync(l => l.Id == id && l.Ativo);
    }

    public async Task<Local?> ObterPorNomeAsync(string nome)
    {
        return await _context.Locais.FirstOrDefaultAsync(l => l.Nome.ToLower() == nome.ToLower() && l.Ativo);
    }

    public async Task<bool> VerificarNomeEmUsoAsync(string nome, long idIgnorado)
    {
        return await _context.Locais.AnyAsync(l => l.Nome.ToLower() == nome.ToLower() && l.Id != idIgnorado && l.Ativo);
    }

    public async Task<bool> PossuiReservasFuturasAsync(long idLocal)
    {
        return await _context.Reservas.AnyAsync(r => r.IdLocal == idLocal && r.Ativo && r.DataInicio >= DateTime.UtcNow);
    }

    public async Task<IEnumerable<Local>> ListarAtivosAsync()
    {
        return await _context.Locais.Where(l => l.Ativo).ToListAsync();
    }

    public async Task AdicionarAsync(Local local)
    {
        await _context.Locais.AddAsync(local);
    }

    public async Task AtualizarAsync(Local local)
    {
        _context.Locais.Update(local);
    }

    public async Task SalvarAlteracoesAsync()
    {
        await _context.SaveChangesAsync();
    }
}