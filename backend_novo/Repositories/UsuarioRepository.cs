using backend_novo.Data;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> getByCpfAsync(string cpf)
    {
       return await _context.Usuario
                .Include(u => u.Categoria)
                .FirstOrDefaultAsync(u => u.Cpf == cpf);
    }

    public async Task<IEnumerable<Usuario>> ListarTodosAsync()
    {
        return await _context.Usuario.ToListAsync();
    }

    public async Task<Usuario> AdicionarAsync(Usuario usuario)
    {
        
        await _context.Usuario.AddAsync(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task<Usuario> AtualizarAsync(Usuario usuario)
    {
        _context.Usuario.Update(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task DeletarAsync(long id)
    {
        var usuario = await _context.Usuario.FindAsync(id);
        if (usuario != null)
        {
            _context.Usuario.Remove(usuario);
            await _context.SaveChangesAsync();
        }
    }
}
