using backend.src.models;

namespace backend.src.repositories.interfaces;

public interface IReservaRepository
{
    Task<Reserva> AdicionarAsync(Reserva reserva);
    Task<IEnumerable<Reserva>> ListarAtivasAsync();
    Task<bool> ExisteConflitoDeHorarioAsync(long idLocal, DateTime dataInicio, DateTime dataFim, long? reservaIdParaIgnorar = null);
}