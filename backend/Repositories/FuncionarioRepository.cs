using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class FuncionarioRepository : IFuncionarioRepository
{
    private readonly AppDbContext _context;

    public FuncionarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Funcionario> AdicionarAsync(Funcionario funcionario)
    {
        await _context.Funcionarios.AddAsync(funcionario);
        return funcionario; 
    }

    public async Task<Funcionario?> ObterPorIdUserAsync(long idUser)
    {
        return await _context.Funcionarios
            .Include(f => f.Usuario)
            .FirstOrDefaultAsync(f => f.IdUser == idUser && f.Ativo);
    }
}