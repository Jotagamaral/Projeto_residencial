using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

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

    public async Task<Morador?> ObterPorIdUserAsync(long idUser)
    {
        return await _context.Moradores.FirstOrDefaultAsync(m => m.IdUser == idUser);
    }
}