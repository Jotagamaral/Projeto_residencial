using backend.src.context;
using backend.src.models;
using backend.src.repositories.interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.repositories;

public class ReclamacaoRepository : IReclamacaoRepository
{
    private readonly AppDbContext _context;

    public ReclamacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Reclamacao> AdicionarAsync(Reclamacao reclamacao)
    {
        await _context.Reclamacoes.AddAsync(reclamacao);
        return reclamacao;
    }

    public async Task<IEnumerable<Reclamacao>> ListarTodasAtivasAsync()
    {
        return await _context.Reclamacoes
            .Where(r => r.Ativo)
            .Include(r => r.Morador)
                .ThenInclude(m => m!.Usuario)
            .Include(r => r.Categoria)
            .OrderByDescending(r => r.Id)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reclamacao>> ListarAtivasPorMoradorAsync(long moradorId)
    {
        return await _context.Reclamacoes
            .Where(r => r.Ativo && r.IdMorador == moradorId)
            .Include(r => r.Morador)
                .ThenInclude(m => m!.Usuario)
            .Include(r => r.Categoria)
            .OrderByDescending(r => r.Id)
            .ToListAsync();
    }

    public async Task<Reclamacao?> ObterPorIdAsync(long id)
    {
        return await _context.Reclamacoes
            .Include(r => r.Morador)
                .ThenInclude(m => m!.Usuario)
            .Include(r => r.Categoria)
            .FirstOrDefaultAsync(r => r.Id == id && r.Ativo);
    }

    public async Task AtualizarAsync(Reclamacao reclamacao)
    {
        _context.Reclamacoes.Update(reclamacao);
        await Task.CompletedTask;
    }

    public async Task DeletarAsync(Reclamacao reclamacao)
    {
        reclamacao.Ativo = false; // Deleção Lógica
        _context.Reclamacoes.Update(reclamacao);
        await Task.CompletedTask;
    }
}