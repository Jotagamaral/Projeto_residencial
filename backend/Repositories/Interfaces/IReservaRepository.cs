using backend.Models;

namespace backend.Repositories.Interfaces;

public interface IReservaRepository
{
    Task<Reserva> AdicionarAsync(Reserva reserva);
    Task<IEnumerable<Reserva>> ListarAtivasAsync();
    Task<bool> ExisteConflitoDeHorarioAsync(long idLocal, DateTime dataInicio, DateTime dataFim, long? reservaIdParaIgnorar = null);
}