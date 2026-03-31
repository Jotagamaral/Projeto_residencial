using Xunit;
using FluentAssertions;
using backend.Services;
using backend.DTOs;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Tests.Services;

public class AuthServiceTests : TestBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        // 1. Configuração do Banco em Memória
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        // 2. Configuração em memória para simular o appsettings.json
        var myConfiguration = new Dictionary<string, string?>
        {
            {"JwtSettings:Secret", "UmaChaveSuperSecretaMuitoLongaParaOJwtFuncionarCorretamente123!"},
            {"JwtSettings:ExpirationInMinutes", "60"},
            {"JwtSettings:Issuer", "CondoSync"},
            {"JwtSettings:Audience", "CondoSyncApp"}
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(myConfiguration)
            .Build();

        // 3. Instância do Serviço
        _service = new AuthService(_configuration, _context);
    }

    [Fact]
    public async Task Autenticar_ComCpfInexistente_DeveRetornarFalha()
    {
        // Arrange
        var dto = new LoginDto { Cpf = "11122233344", Senha = "Senha123" };

        // Act
        var resultado = await _service.AutenticarAsync(dto);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Token.Should().BeNull();
        resultado.User.Should().BeNull();
        resultado.Message.Should().Be("CPF ou senha inválidos.");
    }

    [Fact]
    public async Task Autenticar_ComUsuarioInativo_DeveRetornarFalha()
    {
        // Arrange
        var usuarioInativo = new Usuario 
        { 
            Id = 1, 
            Cpf = "11122233344", 
            Senha = BCrypt.Net.BCrypt.HashPassword("Senha123"), 
            Ativo = false // Usuário inativo
        };
        await _context.Usuario.AddAsync(usuarioInativo);
        await _context.SaveChangesAsync();

        var dto = new LoginDto { Cpf = "11122233344", Senha = "Senha123" };

        // Act
        var resultado = await _service.AutenticarAsync(dto);

        // Assert
        resultado.Token.Should().BeNull();
        resultado.Message.Should().Be("CPF ou senha inválidos.");
    }

    [Fact]
    public async Task Autenticar_ComSenhaIncorreta_DeveRetornarFalha()
    {
        // Arrange
        var senhaCorretaHash = BCrypt.Net.BCrypt.HashPassword("SenhaCerta123");
        var usuario = new Usuario 
        { 
            Id = 2, 
            Cpf = "99988877766", 
            Senha = senhaCorretaHash, 
            Ativo = true 
        };
        await _context.Usuario.AddAsync(usuario);
        await _context.SaveChangesAsync();

        var dto = new LoginDto { Cpf = "99988877766", Senha = "SenhaErrada321" }; // Senha incorreta

        // Act
        var resultado = await _service.AutenticarAsync(dto);

        // Assert
        resultado.Token.Should().BeNull();
        resultado.Message.Should().Be("CPF ou senha inválidos.");
    }

    [Fact]
    public async Task Autenticar_ComCredenciaisValidas_DeveRetornarTokenEUserDto()
    {
        // Arrange
        var senhaOriginal = "SenhaForte123!";
        var categoria = new CategoriaAcesso { CategoriaAcessoId = 1, CategoriaAcessoNome = "ADMIN" };
        var usuario = new Usuario 
        { 
            Id = 3, 
            Nome = "Administrador Sistema",
            Email = "admin@condosync.com",
            Cpf = "12312312312", 
            Senha = BCrypt.Net.BCrypt.HashPassword(senhaOriginal), 
            Ativo = true,
            Categoria = categoria
        };
        
        await _context.CategoriaAcesso.AddAsync(categoria);
        await _context.Usuario.AddAsync(usuario);
        await _context.SaveChangesAsync();

        var dto = new LoginDto { Cpf = "12312312312", Senha = senhaOriginal };

        // Act
        var resultado = await _service.AutenticarAsync(dto);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Message.Should().Be("Login realizado com sucesso.");
        resultado.Token.Should().NotBeNullOrWhiteSpace(); // Valida se o JWT foi gerado
        
        resultado.User.Should().NotBeNull();
        resultado.User.Id.Should().Be(usuario.Id);
        resultado.User.Nome.Should().Be(usuario.Nome);
        resultado.User.Cpf.Should().Be(usuario.Cpf);
        resultado.User.Categoria.Should().Be("ADMIN");
    }

    [Fact]
    public async Task Autenticar_SemSecretConfigurada_DeveLancarExcecao()
    {
        // Arrange
        // Criamos um IConfiguration sem a chave 'Secret'
        var badConfiguration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>()) 
            .Build();

        var servicoComConfigQuebrada = new AuthService(badConfiguration, _context);

        var categoria = new CategoriaAcesso { CategoriaAcessoId = 1, CategoriaAcessoNome = "ADMIN" };

        var usuario = new Usuario 
        { 
            Id = 4, 
            Cpf = "00000000000", 
            Senha = BCrypt.Net.BCrypt.HashPassword("123"), 
            Ativo = true,
            Categoria = categoria
        };
        await _context.CategoriaAcesso.AddAsync(categoria);
        await _context.Usuario.AddAsync(usuario);
        await _context.SaveChangesAsync();

        var dto = new LoginDto { Cpf = "00000000000", Senha = "123" };

        // Act
        Func<Task> acao = async () => await servicoComConfigQuebrada.AutenticarAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("JWT Secret não configurada.");
    }
}