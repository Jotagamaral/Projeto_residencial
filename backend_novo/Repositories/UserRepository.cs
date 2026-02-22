using backend_novo.Data;
using backend_novo.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByCpfAsync(string cpf)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Cpf == cpf);
    }
}
