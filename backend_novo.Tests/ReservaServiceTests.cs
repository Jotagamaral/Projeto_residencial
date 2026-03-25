using Xunit;
using NSubstitute;
using FluentAssertions;
using backend_novo.Services;
using backend_novo.Repositories.Interfaces;
using backend_novo.DTOs;
using backend_novo.Models;
using backend_novo.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using System.Security.Claims;

namespace backend_novo.Tests;

public class ReservaServiceTests
{
    private readonly IReservaRepository _reservaRepo;
    private readonly IMoradorRepository _moradorRepo;
    private readonly IHttpContextAccessor _httpContext;
    private readonly AppDbContext _context;
    private readonly ReservaService _service;

    public ReservaServiceTests()
    {
        // Mocks das interfaces
        _reservaRepo = Substitute.For<IReservaRepository>();
        _moradorRepo = Substitute.For<IMoradorRepository>();
        _httpContext = Substitute.For<IHttpContextAccessor>();
        
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        _context = new AppDbContext(options);
        
        // _context real (em memória)
        _service = new ReservaService(_reservaRepo, _moradorRepo, _httpContext, _context);
    }

    private void MockUsuarioAutenticado(long userId)
    {
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var user = new ClaimsPrincipal(identity);

        var context = new DefaultHttpContext { User = user };
        _httpContext.HttpContext.Returns(context);
    }

    [Fact]
    public async Task CriarReserva_ComDadosValidos_DeveRetornarSucesso()
    {
        // Arrange
        MockUsuarioAutenticado(27);
        var moradorFake = new Morador { Id = 1, IdUser = 27 };
        _moradorRepo.ObterPorIdUserAsync(27).Returns(moradorFake);
        
        var dto = new ReservaCreateDto {
            IdLocal = 1,
            DataInicio = DateTime.UtcNow.AddDays(1),
            DataFim = DateTime.UtcNow.AddDays(1).AddHours(2)
        };

        _reservaRepo.ExisteConflitoDeHorarioAsync(Arg.Any<long>(), Arg.Any<DateTime>(), Arg.Any<DateTime>())
                    .Returns(false);

        // Act
        var resultado = await _service.CriarReservaAsync(dto);

        // Assert
        resultado.Should().NotBeNull();
        resultado.IdLocal.Should().Be(dto.IdLocal);
        await _reservaRepo.Received(1).AdicionarAsync(Arg.Any<Reserva>());
    }

    [Fact]
    public async Task CriarReserva_DataNoPassado_DeveLancarArgumentException()
    {
        // Arrange
        MockUsuarioAutenticado(27);
        _moradorRepo.ObterPorIdUserAsync(27).Returns(new Morador { Id = 1 });

        var dtoInvalido = new ReservaCreateDto {
            IdLocal = 1,
            DataInicio = DateTime.UtcNow.AddDays(-1), // Ontem
            DataFim = DateTime.UtcNow.AddDays(-1).AddHours(2)
        };

        // Act
        var acao = async () => await _service.CriarReservaAsync(dtoInvalido);

        // Assert
        await acao.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Não é possível fazer reservas no passado.");
    }

    [Fact]
    public async Task CriarReserva_ComConflitoDeHorario_DeveLancarArgumentException()
    {
        // Arrange
        MockUsuarioAutenticado(27);
        _moradorRepo.ObterPorIdUserAsync(27).Returns(new Morador { Id = 1 });

        var dto = new ReservaCreateDto {
            IdLocal = 1,
            DataInicio = DateTime.UtcNow.AddDays(1),
            DataFim = DateTime.UtcNow.AddDays(1).AddHours(2)
        };

        // Repositório ENCONTROU um conflito
        _reservaRepo.ExisteConflitoDeHorarioAsync(dto.IdLocal, Arg.Any<DateTime>(), Arg.Any<DateTime>())
                    .Returns(true);

        // Act
        var acao = async () => await _service.CriarReservaAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Este local já possui uma reserva confirmada para o horário selecionado.");
    }
}