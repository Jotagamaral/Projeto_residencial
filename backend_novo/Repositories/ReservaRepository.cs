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

    public async Task<bool> ExisteConflitoDeHorarioAsync(long idLocal, DateTime inicio, DateTime fim)
    {
        return await _context.Reservas
            .AnyAsync(r => 
                r.IdLocal == idLocal &&
                r.Ativo == true &&
                r.DataInicio < fim && 
                r.DataFim > inicio
            );
    }
}