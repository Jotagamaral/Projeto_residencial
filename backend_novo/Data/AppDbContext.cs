using backend_novo.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_novo.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    //? Models 

    //* User
    public DbSet<Usuario> Usuario { get; set; } = null!;
    public DbSet<CategoriaAcesso> CategoriaAcesso { get; set; } = null!;
    public DbSet<CategoriaCargo> CategoriaCargo { get; set; } = null!;
    public DbSet<Morador> Moradores { get; set; } = null!;
    public DbSet<Funcionario> Funcionarios { get; set; } = null!;
    public DbSet<Log> Logs { get; set; } = null!;

    //* Reservas
    public DbSet<Local> Locais { get; set; } = null!;
    public DbSet<CategoriaReserva> CategoriasReserva { get; set; } = null!;
    public DbSet<Reserva> Reservas { get; set; } = null!; 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // modelBuilder.Entity<Morador>(entity =>
        // {
        //     entity.HasIndex(m => m.Cpf).IsUnique();
        //     entity.HasIndex(m => m.Rg).IsUnique();
        //     entity.HasIndex(m => m.Email).IsUnique();
        // });

        // modelBuilder.Entity<Funcionario>(entity =>
        // {
        //     entity.HasIndex(f => f.Cpf).IsUnique();
        //     entity.HasIndex(f => f.Rg).IsUnique();
        //     entity.HasIndex(f => f.Email).IsUnique();
        // });

        modelBuilder.Entity<Funcionario>(entity =>
        {
            entity.HasIndex(f => f.Cpf).IsUnique();
            entity.HasIndex(f => f.Rg).IsUnique();
            entity.HasIndex(f => f.Email).IsUnique();
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.Property(l => l.EntityName).HasMaxLength(255);
            entity.Property(l => l.Action).HasMaxLength(255);
            entity.Property(l => l.Method).HasMaxLength(16);
            entity.Property(l => l.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Entidades

        // Config CSTB001_USER
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasIndex(u => u.Cpf).IsUnique();
            entity.HasIndex(u => u.Rg).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();

            entity.HasOne(u => u.Categoria)
                  .WithMany()
                  .HasForeignKey(u => u.CategoriaAcessoId);
        });
    }
}
