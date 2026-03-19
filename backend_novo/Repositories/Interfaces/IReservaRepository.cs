using backend_novo.Models;

namespace backend_novo.Repositories.Interfaces;

public interface IReservaRepository
{
    Task<Reserva> AdicionarAsync(Reserva reserva);
    
    /// <summary>
    /// Verifica se já existe alguma reserva ativa para o mesmo local que sobreponha o horário desejado.
    /// </summary>
    Task<bool> ExisteConflitoDeHorarioAsync(long idLocal, DateTime inicio, DateTime fim);
}