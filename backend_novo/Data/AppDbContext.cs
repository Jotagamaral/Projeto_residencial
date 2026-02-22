using backend_novo.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Morador> Moradores { get; set; } = null!;
    public DbSet<Funcionario> Funcionarios { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Cpf).IsUnique();
        });

        modelBuilder.Entity<Morador>(entity =>
        {
            entity.HasIndex(m => m.Cpf).IsUnique();
            entity.HasIndex(m => m.Rg).IsUnique();
            entity.HasIndex(m => m.Email).IsUnique();
        });

        modelBuilder.Entity<Funcionario>(entity =>
        {
            entity.HasIndex(f => f.Cpf).IsUnique();
            entity.HasIndex(f => f.Rg).IsUnique();
            entity.HasIndex(f => f.Email).IsUnique();
        });
    }
}
