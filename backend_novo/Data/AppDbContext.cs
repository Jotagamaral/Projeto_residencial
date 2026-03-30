using backend_novo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure; 


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

    //* Reclamações
    public DbSet<CategoriaReclamacao> CategoriasReclamacao { get; set; } = null!;
    public DbSet<Reclamacao> Reclamacoes { get; set; } = null!;

    //* Reservas
    public DbSet<Local> Locais { get; set; } = null!;
    public DbSet<CategoriaReserva> CategoriasReserva { get; set; } = null!;
    public DbSet<Reserva> Reservas { get; set; } = null!;

    //* Encomendas
    public DbSet<Encomenda> Encomendas { get; set; } = null!;
    public DbSet<CategoriaEncomenda> CategoriasEncomenda { get; set; } = null!;

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

        modelBuilder.Entity<Log>(entity =>
        {
            entity.Property(l => l.EntityName).HasMaxLength(255);
            entity.Property(l => l.Action).HasMaxLength(255);
            entity.Property(l => l.Method).HasMaxLength(16);
            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                entity.Property(l => l.CreatedAt).HasDefaultValue(DateTimeOffset.UtcNow);
            }
            else
            {
                // Se for o PostgreSQL (produção), usa o comando nativo do banco
                entity.Property(l => l.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            }
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

        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.Property(e => e.DataInicio)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            entity.Property(e => e.DataFim)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        });

        modelBuilder.Entity<Encomenda>(entity =>
        {
            entity.Property(e => e.DataRecebido)
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            entity.Property(e => e.DataRetirado)
                .HasConversion(
                    v => v.HasValue ? v.Value.ToUniversalTime() : v,
                    v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);
        });

        
    }
}
