using backend_novo.Data;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Repositories;

public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Reserva> AdicionarAsync(Reserva reserva)
    {
        await _context.Reservas.AddAsync(reserva);
        return reserva;
    }

    public async Task<IEnumerable<Reserva>> ListarAtivasAsync()
    {
        return await _context.Reservas
            .Where(r => r.Ativo)
            .Include(r => r.Local)
            .Include(r => r.Morador)
            .OrderByDescending(r => r.DataInicio)
            .ToListAsync();
    }

    public async Task<bool> ExisteConflitoDeHorarioAsync(long idLocal, DateTime dataInicio, DateTime dataFim, long? reservaIdParaIgnorar = null)
{
    // Monta a query base
    var query = _context.Reservas
        .Where(r => r.IdLocal == idLocal && 
                    r.Ativo &&
                    r.DataInicio < dataFim && 
                    r.DataFim > dataInicio);

    // Se recebemos um ID para ignorar, adicionamos essa regra ao WHERE
    if (reservaIdParaIgnorar.HasValue)
    {
        query = query.Where(r => r.Id != reservaIdParaIgnorar.Value);
    }

    return await query.AnyAsync();
}
}