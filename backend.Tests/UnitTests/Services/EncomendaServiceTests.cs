using Xunit;
using NSubstitute;
using FluentAssertions;
using backend.Services;
using backend.Repositories.Interfaces;
using backend.DTOs;
using backend.Models;
using backend.Data;
using backend.Constants;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;


namespace backend.Tests.UnitTests.Services;

public class EncomendaServiceTests : TestBase
{
    private readonly IEncomendaRepository _encomendaRepo;
    private readonly IMoradorRepository _moradorRepo;
    private readonly IFuncionarioRepository _funcionarioRepo;
    private readonly AppDbContext _context;
    private readonly EncomendaService _service;

    public EncomendaServiceTests()
    {
        _encomendaRepo = Substitute.For<IEncomendaRepository>();
        _moradorRepo = Substitute.For<IMoradorRepository>();
        _funcionarioRepo = Substitute.For<IFuncionarioRepository>();

        // Configuração do Banco em Memória
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        _service = new EncomendaService(_encomendaRepo, _moradorRepo, _funcionarioRepo, _context);
    }

    // --------------------------- CREATE TESTS ---------------------------

    [Fact]
    public async Task CriarEncomenda_ComOperadorInvalido_DeveLancarUnauthorizedAccessException()
    {
        // Arrange
        long operadorId = 999;
        var dto = new EncomendaCreateDto { Remetente = "Amazon", MoradorId = 1 };
        
        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns((Funcionario)null!);

        // Act
        Func<Task> acao = async () => await _service.CriarEncomendaAsync(dto, operadorId);

        // Assert
        await acao.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Apenas operadores válidos podem registrar encomendas.");
    }

    [Fact]
    public async Task CriarEncomenda_ComRemetenteVazio_DeveLancarBusinessRuleException()
    {
        // Arrange
        long operadorId = 10;
        var funcionarioFake = new Funcionario { Id = 1, IdUser = operadorId };
        var dto = new EncomendaCreateDto { Remetente = "", MoradorId = 1 }; // Remetente vazio
        
        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns(funcionarioFake);

        // Act
        Func<Task> acao = async () => await _service.CriarEncomendaAsync(dto, operadorId);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("O remetente é obrigatório para registrar a encomenda.");
    }

    [Fact]
    public async Task CriarEncomenda_ComDadosValidos_DeveRetornarSucesso()
    {
        // Arrange
        long operadorId = 10;
        var funcionarioFake = new Funcionario 
        { 
            Id = 1, 
            IdUser = operadorId,
            Usuario = new Usuario { Nome = "Porteiro Carlos" } 
        };
        
        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns(funcionarioFake);

        var dto = new EncomendaCreateDto 
        { 
            Remetente = "Mercado Livre", 
            MoradorId = 5 
        };

        // Act
        var resultado = await _service.CriarEncomendaAsync(dto, operadorId);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Remetente.Should().Be("Mercado Livre");
        resultado.Funcionario.Should().Be("Porteiro Carlos");
        resultado.Status.Should().Be(CategoriaEncomendaConstants.PENDENTE_STRING);
        
        await _encomendaRepo.Received(1).AdicionarAsync(Arg.Is<Encomenda>(e => 
            e.Remetente == "Mercado Livre" &&
            e.IdMorador == 5 &&
            e.IdFuncionario == 1 &&
            e.IdCategoriaEncomenda == CategoriaEncomendaConstants.PENDENTE_ID &&
            e.DataRetirado == null
        ));
    }

    // --------------------------- READ TESTS ---------------------------

    [Fact]
    public async Task ListarMinhasEncomendas_MoradorInexistente_DeveLancarUnauthorizedAccessException()
    {
        // Arrange
        long userId = 999;
        _moradorRepo.ObterPorIdUserAsync(userId).Returns((Morador)null!);

        // Act
        Func<Task> acao = async () => await _service.ListarMinhasEncomendasAsync(userId);

        // Assert
        await acao.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Perfil de morador não encontrado.");
    }

    [Fact]
    public async Task ListarMinhasEncomendas_ComMoradorValido_DeveRetornarLista()
    {
        // Arrange
        long userId = 10;
        var moradorFake = new Morador { Id = 5, IdUser = userId, Usuario = new Usuario { Nome = "João Gabriel" } };
        
        var encomendasFakes = new List<Encomenda>
        {
            new Encomenda { Id = 1, Remetente = "Amazon", IdMorador = 5, Morador = moradorFake }
        };

        _moradorRepo.ObterPorIdUserAsync(userId).Returns(moradorFake);
        _encomendaRepo.ListarPorMoradorAsync(moradorFake.Id).Returns(encomendasFakes);

        // Act
        var resultado = await _service.ListarMinhasEncomendasAsync(userId);

        // Assert
        resultado.Should().NotBeNullOrEmpty();
        resultado.First().Remetente.Should().Be("Amazon");
        resultado.First().Morador.Should().Be("João Gabriel");
    }

    // --------------------------- UPDATE TESTS ---------------------------

    [Fact]
    public async Task AtualizarRetirada_ComOperadorInvalido_DeveLancarUnauthorizedAccessException()
    {
        // Arrange
        long operadorId = 999;
        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns((Funcionario)null!);

        // Act
        Func<Task> acao = async () => await _service.AtualizarRetiradaAsync(1, true, operadorId);

        // Assert
        await acao.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Operador inválido.");
    }

    [Fact]
    public async Task AtualizarRetirada_ParaRetiradaTrue_DeveAtualizarDataEStatus()
    {
        // Arrange
        long operadorId = 10;
        long encomendaId = 1;
        var funcionarioFake = new Funcionario { Id = 1, IdUser = operadorId };
        var encomendaFake = new Encomenda { Id = encomendaId, Remetente = "Shopee" };

        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns(funcionarioFake);
        _encomendaRepo.ObterPorIdAsync(encomendaId).Returns(encomendaFake);

        // Act
        var resultado = await _service.AtualizarRetiradaAsync(encomendaId, true, operadorId);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Status.Should().Be(CategoriaEncomendaConstants.ENTREGUE_STRING);
        
        await _encomendaRepo.Received(1).AtualizarAsync(Arg.Is<Encomenda>(e => 
            e.IdCategoriaEncomenda == CategoriaEncomendaConstants.ENTREGUE_ID &&
            e.DataRetirado != null
        ));
    }

    // --------------------------- DELETE TESTS ---------------------------

    [Fact]
    public async Task CancelarEncomenda_ComOperadorInvalido_DeveLancarUnauthorizedAccessException()
    {
        // Arrange
        long operadorId = 999;
        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns((Funcionario)null!);

        // Act
        Func<Task> acao = async () => await _service.CancelarEncomendaAsync(1, operadorId);

        // Assert
        await acao.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Operador inválido.");
    }

    [Fact]
    public async Task CancelarEncomenda_ComEncomendaInexistente_DeveLancarNotFoundException()
    {
        // Arrange
        long operadorId = 10;
        long encomendaId = 999;
        var funcionarioFake = new Funcionario { Id = 1, IdUser = operadorId };

        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns(funcionarioFake);
        _encomendaRepo.ObterPorIdAsync(encomendaId).Returns((Encomenda)null!);

        // Act
        Func<Task> acao = async () => await _service.CancelarEncomendaAsync(encomendaId, operadorId);

        // Assert
        await acao.Should().ThrowAsync<NotFoundException>()
            .WithMessage("A encomenda que você tentou cancelar não existe.");
    }

    [Fact]
    public async Task CancelarEncomenda_ComDadosValidos_DeveDeletarEncomenda()
    {
        // Arrange
        long operadorId = 10;
        long encomendaId = 1;
        var funcionarioFake = new Funcionario { Id = 1, IdUser = operadorId };
        var encomendaFake = new Encomenda { Id = encomendaId, Remetente = "FedEx" };

        _funcionarioRepo.ObterPorIdUserAsync(operadorId).Returns(funcionarioFake);
        _encomendaRepo.ObterPorIdAsync(encomendaId).Returns(encomendaFake);

        // Act
        await _service.CancelarEncomendaAsync(encomendaId, operadorId);

        // Assert
        await _encomendaRepo.Received(1).DeletarAsync(encomendaFake);
    }
}