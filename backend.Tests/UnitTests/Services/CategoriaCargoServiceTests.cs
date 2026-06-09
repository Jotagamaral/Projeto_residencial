using Xunit;
using NSubstitute;
using FluentAssertions;
using backend.src.services;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;
using backend.src.dtos.CategoriaCargo;
using backend.src.models;
using backend.src.exceptions;

namespace backend.Tests.UnitTests.Services;

public class CategoriaCargoServiceTests : TestBase
{
    private readonly ICategoriaCargoRepository _categoriaCargoRepo;
    private readonly IFuncionarioRepository _funcionarioRepo;
    private readonly ICacheService _cacheService;
    private readonly CategoriaCargoService _service;

    public CategoriaCargoServiceTests()
    {
        _categoriaCargoRepo = Substitute.For<ICategoriaCargoRepository>();
        _funcionarioRepo = Substitute.For<IFuncionarioRepository>();
        _cacheService = Substitute.For<ICacheService>();

        _service = new CategoriaCargoService(_categoriaCargoRepo, _funcionarioRepo, _cacheService);
    }

    [Fact]
    public async Task CriarCargo_ComDadosValidos_DeveRetornarSucessoESalvarEDescartarCache()
    {
        // Arrange
        var dto = new CategoriaCargoCreateDto { Nome = "Jardineiro" };
        _categoriaCargoRepo.ObterPorNomeAsync("Jardineiro").Returns((CategoriaCargo)null!);

        // Act
        var resultado = await _service.CriarCargoAsync(dto);

        // Assert
        resultado.Should().NotBeNull();
        resultado.Nome.Should().Be("Jardineiro");
        await _categoriaCargoRepo.Received(1).AdicionarAsync(Arg.Is<CategoriaCargo>(c => c.Nome == "Jardineiro" && c.Ativo));
        await _categoriaCargoRepo.Received(1).SalvarAlteracoesAsync();
        await _cacheService.Received(1).RemoveAsync("categoria_cargo:ativas:todas");
    }

    [Fact]
    public async Task CriarCargo_ComNomeDuplicado_DeveLancarBusinessRuleException()
    {
        // Arrange
        var dto = new CategoriaCargoCreateDto { Nome = "Porteiro" };
        var cargoExistente = new CategoriaCargo { Id = 1, Nome = "Porteiro", Ativo = true };
        _categoriaCargoRepo.ObterPorNomeAsync("Porteiro").Returns(cargoExistente);

        // Act
        Func<Task> acao = async () => await _service.CriarCargoAsync(dto);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Já existe uma categoria de cargo com este nome.");

        await _categoriaCargoRepo.DidNotReceive().AdicionarAsync(Arg.Any<CategoriaCargo>());
        await _categoriaCargoRepo.DidNotReceive().SalvarAlteracoesAsync();
    }

    [Fact]
    public async Task DeletarCargo_ComFuncionariosVinculados_DeveLancarBusinessRuleException()
    {
        // Arrange
        long cargoId = 5;
        var cargo = new CategoriaCargo { Id = cargoId, Nome = "Zelador", Ativo = true };
        _categoriaCargoRepo.ObterPorIdAsync(cargoId).Returns(cargo);
        _funcionarioRepo.ExisteFuncionarioComCargoAsync(cargoId).Returns(true);

        // Act
        Func<Task> acao = async () => await _service.DeletarCargoAsync(cargoId);

        // Assert
        await acao.Should().ThrowAsync<BusinessRuleException>()
            .WithMessage("Não é possível excluir esta categoria pois existem funcionários ativos vinculados a ela.");

        await _categoriaCargoRepo.DidNotReceive().AtualizarAsync(Arg.Any<CategoriaCargo>());
        await _categoriaCargoRepo.DidNotReceive().SalvarAlteracoesAsync();
    }

    [Fact]
    public async Task DeletarCargo_SemFuncionariosVinculados_DeveInativarESalvar()
    {
        // Arrange
        long cargoId = 5;
        var cargo = new CategoriaCargo { Id = cargoId, Nome = "Zelador", Ativo = true };
        _categoriaCargoRepo.ObterPorIdAsync(cargoId).Returns(cargo);
        _funcionarioRepo.ExisteFuncionarioComCargoAsync(cargoId).Returns(false);

        // Act
        var resultado = await _service.DeletarCargoAsync(cargoId);

        // Assert
        resultado.Should().BeTrue();
        cargo.Ativo.Should().BeFalse();
        await _categoriaCargoRepo.Received(1).AtualizarAsync(cargo);
        await _categoriaCargoRepo.Received(1).SalvarAlteracoesAsync();
        await _cacheService.Received(1).RemoveAsync("categoria_cargo:ativas:todas");
        await _cacheService.Received(1).RemoveAsync($"categoria_cargo:detalhe:{cargoId}");
    }
}
