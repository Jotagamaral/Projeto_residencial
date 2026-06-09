using Xunit;
using NSubstitute;
using FluentAssertions;
using backend.src.services;
using backend.src.repositories.interfaces;
using backend.src.dtos.Usuario;
using backend.src.models;
using backend.src.context;
using backend.src.exceptions;
using backend.src.constants;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.UnitTests.Services;

public class UsuarioServiceTests : TestBase
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IMoradorRepository _moradorRepo;
    private readonly IFuncionarioRepository _funcionarioRepo;
    private readonly AppDbContext _context;
    private readonly UsuarioService _service;

    public UsuarioServiceTests()
    {
        _usuarioRepo = Substitute.For<IUsuarioRepository>();
        _moradorRepo = Substitute.For<IMoradorRepository>();
        _funcionarioRepo = Substitute.For<IFuncionarioRepository>();

        // Configuração do Banco em Memória
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .ConfigureWarnings(x => x.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _context = new AppDbContext(options);

        _service = new UsuarioService(_usuarioRepo, _moradorRepo, _funcionarioRepo, _context);
    }

    [Fact]
    public async Task CriarUsuarioAsync_ComCpfDuplicado_DeveLancarBusinessRuleException()
    {
        // Arrange
        var dto = new UsuarioCreateDto { Cpf = "12345678901", Email = "novo@email.com", Senha = "123", CategoriaAcessoId = CategoriaAcessoConstants.MORADOR_ID, Apartamento = 101, Bloco = "A" };
        var usuarioExistente = new Usuario { Id = 1, Cpf = "12345678901" };
        _usuarioRepo.getByCpfAsync("12345678901").Returns(usuarioExistente);

        // Act
        Func<Task> acao = async () => await _service.CriarUsuarioAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Este CPF já está em uso.");
    }

    [Fact]
    public async Task CriarUsuarioAsync_ComEmailDuplicado_DeveLancarBusinessRuleException()
    {
        // Arrange
        var dto = new UsuarioCreateDto { Cpf = "12345678901", Email = "duplicado@email.com", Senha = "123", CategoriaAcessoId = CategoriaAcessoConstants.MORADOR_ID, Apartamento = 101, Bloco = "A" };
        _usuarioRepo.getByCpfAsync("12345678901").Returns((Usuario)null!);
        
        // Adiciona usuário com mesmo e-mail no DbContext em memória
        var outroUsuario = new Usuario { Id = 2, Cpf = "98765432100", Email = "duplicado@email.com" };
        await _context.Usuario.AddAsync(outroUsuario);
        await _context.SaveChangesAsync();

        // Act
        Func<Task> acao = async () => await _service.CriarUsuarioAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Este e-mail já está em uso.");
    }

    [Fact]
    public async Task CriarUsuarioAsync_ComRgDuplicado_DeveLancarBusinessRuleException()
    {
        // Arrange
        var dto = new UsuarioCreateDto { Cpf = "12345678901", Email = "novo@email.com", Rg = "RG123", Senha = "123", CategoriaAcessoId = CategoriaAcessoConstants.MORADOR_ID, Apartamento = 101, Bloco = "A" };
        _usuarioRepo.getByCpfAsync("12345678901").Returns((Usuario)null!);
        
        // Adiciona usuário com mesmo RG no DbContext em memória
        var outroUsuario = new Usuario { Id = 2, Cpf = "98765432100", Email = "outro@email.com", Rg = "RG123" };
        await _context.Usuario.AddAsync(outroUsuario);
        await _context.SaveChangesAsync();

        // Act
        Func<Task> acao = async () => await _service.CriarUsuarioAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Este RG já está em uso.");
    }

    [Fact]
    public async Task CriarUsuarioAsync_MoradorValido_DeveRetornarSucesso()
    {
        // Arrange
        var dto = new UsuarioCreateDto 
        { 
            Nome = "Morador Novo", 
            Cpf = "12345678901", 
            Email = "novo@email.com", 
            Senha = "Senha@123",
            CategoriaAcessoId = CategoriaAcessoConstants.MORADOR_ID,
            Apartamento = 102,
            Bloco = "B"
        };
        _usuarioRepo.getByCpfAsync("12345678901").Returns((Usuario)null!);

        var usuarioSalvo = new Usuario { Id = 10, Nome = dto.Nome, Cpf = dto.Cpf, Email = dto.Email, CategoriaAcessoId = dto.CategoriaAcessoId };
        _usuarioRepo.AdicionarAsync(Arg.Any<Usuario>()).Returns(usuarioSalvo);

        // Act
        var resultado = await _service.CriarUsuarioAsync(dto);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Nome.Should().Be(dto.Nome);
        resultado.Email.Should().Be(dto.Email);
        resultado.CategoriaAcesso.Should().Be("MORADOR");
        
        await _usuarioRepo.Received(1).AdicionarAsync(Arg.Is<Usuario>(u => u.Nome == dto.Nome && u.Cpf == dto.Cpf));
        await _moradorRepo.Received(1).AdicionarAsync(Arg.Is<Morador>(m => m.IdUser == 10 && m.Apartamento == 102 && m.Bloco == "B"));
    }
}
