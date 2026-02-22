using backend_novo.Data;
using backend_novo.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Repositories;

public class MoradorRepository : IMoradorRepository
{
    private readonly AppDbContext _context;

    public MoradorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Morador?> GetByCpfAsync(string cpf)
    {
        return await _context.Moradores.FirstOrDefaultAsync(m => m.Cpf == cpf);
    }
}
