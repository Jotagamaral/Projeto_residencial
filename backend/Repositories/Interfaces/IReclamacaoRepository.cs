// Repositories/Interfaces/IReclamacaoRepository.cs
using backend.Models;

namespace backend.Repositories.Interfaces;

public interface IReclamacaoRepository
{
    Task<Reclamacao> AdicionarAsync(Reclamacao reclamacao);
    Task<IEnumerable<Reclamacao>> ListarTodasAtivasAsync();
    Task<IEnumerable<Reclamacao>> ListarAtivasPorMoradorAsync(long moradorId);
    Task<Reclamacao?> ObterPorIdAsync(long id);
    Task AtualizarAsync(Reclamacao reclamacao);
    Task DeletarAsync(Reclamacao reclamacao);
}