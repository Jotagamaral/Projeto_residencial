using Xunit;
using NSubstitute;
using FluentAssertions;
using backend.src.services;
using backend.src.repositories.interfaces;
using backend.src.dtos.Reserva;
using backend.src.models;
using backend.src.context;
using backend.src.exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.UnitTests.Services;

// Agora herdando de TestBase
public class ReservaServiceTests : TestBase
{
    private readonly IReservaRepository _reservaRepo;
    private readonly IMoradorRepository _moradorRepo;
    private readonly IHttpContextAccessor _httpContext;
    private readonly AppDbContext _context;
    private readonly ReservaService _service;

    public ReservaServiceTests()
    {
        _reservaRepo = Substitute.For<IReservaRepository>();
        _moradorRepo = Substitute.For<IMoradorRepository>();
        
        _httpContext = CriarHttpContextAccessorMock(27);
        
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        _context = new AppDbContext(options);
        
        _service = new ReservaService(_reservaRepo, _moradorRepo, _httpContext, _context);
    }

    [Fact]
    public async Task CriarReserva_ComDadosValidos_DeveRetornarSucesso()
    {
        // Arrange
        long userId = 27;

        var moradorFake = new Morador { Id = 1, IdUser = userId };
        _moradorRepo.ObterPorIdUserAsync(userId).Returns(moradorFake);
        
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
    public async Task CriarReserva_DataNoPassado_DeveLancarBusinessRuleException()
    {
        // Arrange
        _moradorRepo.ObterPorIdUserAsync(27).Returns(new Morador { Id = 1 });

        var dtoInvalido = new ReservaCreateDto {
            IdLocal = 1,
            DataInicio = DateTime.UtcNow.AddDays(-1), 
            DataFim = DateTime.UtcNow.AddDays(-1).AddHours(2)
        };

        // Act
        var acao = async () => await _service.CriarReservaAsync(dtoInvalido);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Não é possível fazer reservas no passado.");
    }

    [Fact]
    public async Task CriarReserva_ComConflitoDeHorario_DeveLancarBusinessRuleException()
    {
        // Arrange
        _moradorRepo.ObterPorIdUserAsync(27).Returns(new Morador { Id = 1 });

        var dto = new ReservaCreateDto {
            IdLocal = 1,
            DataInicio = DateTime.UtcNow.AddDays(1),
            DataFim = DateTime.UtcNow.AddDays(1).AddHours(2)
        };

        _reservaRepo.ExisteConflitoDeHorarioAsync(dto.IdLocal, Arg.Any<DateTime>(), Arg.Any<DateTime>())
                    .Returns(true);

        // Act
        var acao = async () => await _service.CriarReservaAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Este local já possui uma reserva confirmada para o horário selecionado.");
    }
}