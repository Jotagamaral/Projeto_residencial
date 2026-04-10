using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class AvisoRepository : IAvisoRepository
{
    private readonly AppDbContext _context;

    public AvisoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Aviso> AdicionarAsync(Aviso aviso)
    {
        await _context.Set<Aviso>().AddAsync(aviso);
        return aviso;
    }

    public async Task<IReadOnlyList<Aviso>> ListarAtivosNaoExpiradosAsync(DateTime referenciaUtc)
    {
        return await _context.Set<Aviso>()
            .AsNoTracking()
            .Where(a =>
                a.Ativo &&
                (a.DataExpiracao == null || a.DataExpiracao >= referenciaUtc))
            .OrderByDescending(a => a.DataInicio ?? DateTime.MinValue)
            .ThenByDescending(a => a.Id)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Aviso>> ListarTodosAsync()
    {
        return await _context.Set<Aviso>()
            .AsNoTracking()
            .OrderByDescending(a => a.DataInicio ?? DateTime.MinValue)
            .ThenByDescending(a => a.Id)
            .ToListAsync();
    }

    public async Task<Aviso?> ObterPorIdTrackedAsync(long id)
    {
        return await _context.Set<Aviso>().FirstOrDefaultAsync(a => a.Id == id);
    }
}
