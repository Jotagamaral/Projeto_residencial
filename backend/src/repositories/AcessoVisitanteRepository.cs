using backend.src.context;
using backend.src.models;
using backend.src.repositories.interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.repositories;

public class AcessoVisitanteRepository : IAcessoVisitanteRepository
{
    private readonly AppDbContext _context;

    public AcessoVisitanteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AcessoVisitante?> ObterPorIdAsync(long id)
    {
        return await _context.AcessosVisitante
            .Include(a => a.Visitante)
            .Include(a => a.Morador)
            .Include(a => a.Funcionario)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<AcessoVisitante>> ListarTodosAsync()
    {
        return await _context.AcessosVisitante
            .Include(a => a.Visitante)
            .Include(a => a.Morador)
            .Include(a => a.Funcionario)
            .OrderByDescending(a => a.DataEntrada)
            .ToListAsync();
    }

    public async Task<IEnumerable<AcessoVisitante>> ListarAcessosEmAbertoAsync()
    {
        return await _context.AcessosVisitante
            .Include(a => a.Visitante)
            .Include(a => a.Morador)
            .Include(a => a.Funcionario)
            .Where(a => a.DataSaida == null)
            .OrderByDescending(a => a.DataEntrada)
            .ToListAsync();
    }

    public async Task AdicionarAsync(AcessoVisitante acesso)
    {
        await _context.AcessosVisitante.AddAsync(acesso);
    }

    public async Task AtualizarAsync(AcessoVisitante acesso)
    {
        _context.AcessosVisitante.Update(acesso);
    }

    public async Task SalvarAlteracoesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
