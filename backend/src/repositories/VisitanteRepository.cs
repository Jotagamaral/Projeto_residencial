using backend.src.context;
using backend.src.models;
using backend.src.repositories.interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.repositories;

public class VisitanteRepository : IVisitanteRepository
{
    private readonly AppDbContext _context;

    public VisitanteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Visitante>> ListarAtivosAsync()
    {
        return await _context.Visitantes
            .Where(v => v.Ativo)
            .OrderBy(v => v.Nome)
            .ToListAsync();
    }

    public async Task<IEnumerable<(Visitante, AcessoVisitante?)>> ListarAtivosComUltimoAcessoAsync()
    {
        var visitantes = await _context.Visitantes
            .Where(v => v.Ativo)
            .OrderBy(v => v.Nome)
            .ToListAsync();

        var ultimosAcessos = await _context.AcessosVisitante
            .GroupBy(a => a.IdVisitante)
            .Select(g => g.OrderByDescending(a => a.DataEntrada).First())
            .ToListAsync();

        var mapaAcessos = ultimosAcessos.ToDictionary(a => a.IdVisitante);

        return visitantes.Select(v =>
            (v, mapaAcessos.TryGetValue(v.Id, out var acesso) ? acesso : null));
    }

    public async Task<Visitante?> ObterPorCpfAsync(string cpf)
    {
        return await _context.Visitantes
            .FirstOrDefaultAsync(v => v.Cpf == cpf && v.Ativo);
    }

    public async Task<Visitante?> ObterPorIdAsync(long id)
    {
        return await _context.Visitantes
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<int> InativarPorIdAsync(long id)
    {
        // UPDATE direto via SQL — não depende de carregar a entidade
        return await _context.Visitantes
            .Where(v => v.Id == id)
            .ExecuteUpdateAsync(s => s.SetProperty(v => v.Ativo, false));
    }

    public async Task AdicionarAsync(Visitante visitante)
    {
        await _context.Visitantes.AddAsync(visitante);
    }

    public async Task AtualizarAsync(Visitante visitante)
    {
        _context.Visitantes.Update(visitante);
    }

    public async Task SalvarAlteracoesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
