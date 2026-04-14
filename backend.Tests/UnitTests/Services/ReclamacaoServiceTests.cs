using Xunit;
using NSubstitute;
using FluentAssertions;
using backend.src.services;
using backend.src.services.interfaces;
using backend.src.repositories.interfaces;
using backend.src.dtos.Reclamacao;
using backend.src.models;
using backend.src.context;
using Microsoft.EntityFrameworkCore;


namespace backend.Tests.UnitTests.Services;

public class ReclamacaoServiceTests : TestBase
{
    private readonly IReclamacaoRepository _reclamacaoRepo;
    private readonly IMoradorRepository _moradorRepo;
    private readonly ICacheService _cacheService;
    private readonly AppDbContext _context;
    private readonly ReclamacaoService _service;

    public ReclamacaoServiceTests()
    {
        _reclamacaoRepo = Substitute.For<IReclamacaoRepository>();
        _moradorRepo = Substitute.For<IMoradorRepository>();
        _cacheService = Substitute.For<ICacheService>();

        // Configuração do Banco em Memória
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);

        _service = new ReclamacaoService(_reclamacaoRepo, _moradorRepo, _context, _cacheService);
    }

    [Fact]
    public async Task CriarReclamacao_ComDadosValidos_DeveRetornarSucesso()
    {
        // Arrange
        long userId = 10;
        var moradorFake = new Morador { Id = 1, IdUser = userId, Bloco = "A", Apartamento = 101 };
        _moradorRepo.ObterPorIdUserAsync(userId).Returns(moradorFake);

        var dto = new ReclamacaoCreateDto 
        { 
            Titulo = "Barulho excessivo", 
            Descricao = "O vizinho está com som alto após as 22h." 
        };

        // Mock do retorno após o save (para o Mapper)
        var reclamacaoSalva = new Reclamacao 
        { 
            Id = 123, 
            IdMorador = 1, 
            Titulo = dto.Titulo, 
            Descricao = dto.Descricao,
            Morador = moradorFake,
            Categoria = new CategoriaReclamacao { Nome = "ABERTA" }
        };
        _reclamacaoRepo.ObterPorIdAsync(Arg.Any<long>()).Returns(reclamacaoSalva);

        // Act
        var resultado = await _service.CriarReclamacaoAsync(dto, userId);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Titulo.Should().Be(dto.Titulo);
        resultado.Status.Should().Be("ABERTA");
        await _reclamacaoRepo.Received(1).AdicionarAsync(Arg.Any<Reclamacao>());
    }

    [Fact]
    public async Task CancelarReclamacao_DeOutroUsuario_DeveLancarUnauthorizedAccessException()
    {
        // Arrange
        long meuUserId = 10;
        long idReclamacaoAlheia = 50;
        
        var reclamacaoDeOutro = new Reclamacao 
        { 
            Id = idReclamacaoAlheia, 
            IdMorador = 2, // ID de outro morador
            Morador = new Morador { Id = 2, IdUser = 99 } // Pertence ao User 99
        };

        _reclamacaoRepo.ObterPorIdAsync(idReclamacaoAlheia).Returns(reclamacaoDeOutro);

        // Act
        Func<Task> acao = async () => await _service.CancelarReclamacaoAsync(idReclamacaoAlheia, meuUserId);

        // Assert
        await acao.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Você só pode deletar suas próprias reclamações.");
        
        await _reclamacaoRepo.DidNotReceive().DeletarAsync(Arg.Any<Reclamacao>());
    }

    [Fact]
    public async Task ListarMinhasReclamacoes_MoradorInexistente_DeveLancarUnauthorizedAccessException()
    {
        // Arrange
        long userIdInvalido = 999;

        _cacheService.GetAsync<IEnumerable<ReclamacaoResponseDto>>(Arg.Any<string>())
        .Returns((IEnumerable<ReclamacaoResponseDto>)null!);

        _moradorRepo.ObterPorIdUserAsync(userIdInvalido).Returns((Morador)null!);

        // Act
        Func<Task> acao = async () => await _service.ListarMinhasReclamacoesAsync(userIdInvalido);

        // Assert
        await acao.Should().ThrowAsync<UnauthorizedAccessException>();
    }
}