// Services/CategoriaCargoService.cs
using backend.src.dtos.CategoriaCargo;
using backend.src.exceptions;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class CategoriaCargoService : ICategoriaCargoService
{
    private readonly ICategoriaCargoRepository _categoriaCargoRepository;
    private readonly IFuncionarioRepository _funcionarioRepository;

    public CategoriaCargoService(
        ICategoriaCargoRepository categoriaCargoRepository,
        IFuncionarioRepository funcionarioRepository)
    {
        _categoriaCargoRepository = categoriaCargoRepository;
        _funcionarioRepository = funcionarioRepository;
    }

    public async Task<CategoriaCargoResponseDto> CriarCargoAsync(CategoriaCargoCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            throw new BusinessRuleException("O nome da categoria de cargo é obrigatório.");

        var nomeFormatado = dto.Nome.Trim();

        var cargoExistente = await _categoriaCargoRepository.ObterPorNomeAsync(nomeFormatado);

        if (cargoExistente != null)
            throw new BusinessRuleException("Já existe uma categoria de cargo com este nome.");

        var novoCargo = new CategoriaCargo
        {
            Nome = nomeFormatado,
            Ativo = true
        };

        await _categoriaCargoRepository.AdicionarAsync(novoCargo);

        return new CategoriaCargoResponseDto { Id = novoCargo.Id, Nome = novoCargo.Nome };
    }

    public async Task<IEnumerable<CategoriaCargoResponseDto>> ListarCargosAsync()
    {
        var cargos = await _categoriaCargoRepository.ListarAtivosAsync();
        return cargos.Select(c => new CategoriaCargoResponseDto { Id = c.Id, Nome = c.Nome });
    }

    public async Task<CategoriaCargoResponseDto> ObterCargoPorIdAsync(long id)
    {
        var cargo = await _categoriaCargoRepository.ObterPorIdAsync(id);

        if (cargo == null)
            throw new NotFoundException("Categoria de cargo não encontrada.");

        return new CategoriaCargoResponseDto { Id = cargo.Id, Nome = cargo.Nome };
    }

    public async Task<CategoriaCargoResponseDto> AtualizarCargoAsync(long id, CategoriaCargoUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            throw new BusinessRuleException("O nome da categoria de cargo é obrigatório.");

        var nomeFormatado = dto.Nome.Trim();

        var cargo = await _categoriaCargoRepository.ObterPorIdAsync(id);
        
        if (cargo == null)
            throw new NotFoundException("Categoria de cargo não encontrada.");

        var nomeEmUso = await _categoriaCargoRepository.VerificarNomeEmUsoAsync(nomeFormatado, id);

        if (nomeEmUso)
            throw new BusinessRuleException("Já existe outra categoria de cargo utilizando este nome.");

        cargo.Nome = nomeFormatado;

        await _categoriaCargoRepository.AtualizarAsync(cargo);

        return new CategoriaCargoResponseDto { Id = cargo.Id, Nome = cargo.Nome };
    }

    public async Task<bool> DeletarCargoAsync(long id)
    {
        var cargo = await _categoriaCargoRepository.ObterPorIdAsync(id);
        
        if (cargo == null)
            throw new NotFoundException("Categoria de cargo não encontrada.");

        var possuiFuncionariosVinculados = await _funcionarioRepository.ExisteFuncionarioComCargoAsync(id);

        if (possuiFuncionariosVinculados)
            throw new BusinessRuleException("Não é possível excluir esta categoria pois existem funcionários ativos vinculados a ela.");

        cargo.Ativo = false;
        
        await _categoriaCargoRepository.AtualizarAsync(cargo);

        return true;
    }
}