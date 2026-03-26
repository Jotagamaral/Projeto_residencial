using backend_novo.Data;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Repositories;

public class EncomendaRepository : IEncomendaRepository
{
    private readonly AppDbContext _context;

    public EncomendaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Encomenda> AdicionarAsync(Encomenda encomenda)
    {
        await _context.Encomendas.AddAsync(encomenda);
        return encomenda;
    }

    public async Task<IEnumerable<Encomenda>> ListarAtivasAsync()
    {
        return await _context.Encomendas
            .Where(e => e.Ativo)
            .Include(e => e.Morador)
                .ThenInclude(m => m!.Usuario)
            .Include(e => e.Funcionario)
                .ThenInclude(f => f!.Usuario)
            .Include(e => e.Categoria)
            .OrderByDescending(e => e.DataRecebido)
            .ToListAsync();
    }

    public async Task<Encomenda?> ObterPorIdAsync(long id)
    {
        return await _context.Encomendas
            .Include(e => e.Morador)
                .ThenInclude(m => m!.Usuario)
            .Include(e => e.Funcionario)
                .ThenInclude(f => f!.Usuario)
            .Include(e => e.Categoria)
            .FirstOrDefaultAsync(e => e.Id == id && e.Ativo);
    }

    public async Task AtualizarAsync(Encomenda encomenda)
    {
        _context.Encomendas.Update(encomenda);
        await Task.CompletedTask;
    }

    public async Task DeletarAsync(Encomenda encomenda)
    {
        encomenda.Ativo = false; // Deleção lógica
        _context.Encomendas.Update(encomenda);
        await Task.CompletedTask;
    }
}