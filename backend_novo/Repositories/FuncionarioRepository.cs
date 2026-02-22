using backend_novo.Data;
using backend_novo.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Repositories;

public class FuncionarioRepository : IFuncionarioRepository
{
    private readonly AppDbContext _context;

    public FuncionarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Funcionario?> GetByCpfAsync(string cpf)
    {
        return await _context.Funcionarios.FirstOrDefaultAsync(f => f.Cpf == cpf);
    }
}
