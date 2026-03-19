using backend_novo.Data;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;

namespace backend_novo.Repositories;

public class MoradorRepository : IMoradorRepository
{
    private readonly AppDbContext _context;

    public MoradorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Morador> AdicionarAsync(Morador morador)
    {
        await _context.Moradores.AddAsync(morador);
        return morador; 
    }
}