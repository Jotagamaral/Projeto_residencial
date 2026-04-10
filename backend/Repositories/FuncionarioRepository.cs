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
            .Include(f => f.CategoriaCargo)
            .FirstOrDefaultAsync(f => f.IdUser == idUser && f.Ativo);
    }

    public async Task<bool> ExisteFuncionarioComCargoAsync(long cargoId)
    {
        return await _context.Funcionarios
            .AnyAsync(f => f.IdCategoriaCargo == cargoId && f.Ativo);
    }

    public async Task<Funcionario?> ObterPorIdAsync(long id)
    {
        return await _context.Funcionarios
            .Include(f => f.Usuario)
            .Include(f => f.CategoriaCargo)
            .FirstOrDefaultAsync(f => f.Id == id && f.Ativo);
    }

    public async Task<IEnumerable<Funcionario>> ListarAtivosAsync()
    {
        return await _context.Funcionarios
            .Include(f => f.Usuario)
            .Include(f => f.CategoriaCargo)
            .Where(f => f.Ativo && f.Usuario!.Ativo)
            .ToListAsync();
    }

    public async Task AtualizarAsync(Funcionario funcionario)
    {
        _context.Funcionarios.Update(funcionario);
    }

    public async Task SalvarAlteracoesAsync()
    {
        await _context.SaveChangesAsync();
    }
}