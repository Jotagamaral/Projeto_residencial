// Services/LocalService.cs
using backend.DTOs;
using backend.Exceptions;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services;

public class LocalService : ILocalService
{
    private readonly ILocalRepository _localRepository;

    public LocalService(ILocalRepository localRepository)
    {
        _localRepository = localRepository;
    }

    public async Task<LocalResponseDto> CriarLocalAsync(LocalCreateDto dto)
    {
        var nomeFormatado = dto.Nome.Trim();

        var localExistente = await _localRepository.ObterPorNomeAsync(nomeFormatado);
        if (localExistente != null)
            throw new BusinessRuleException("Já existe um local cadastrado com este nome.");

        var novoLocal = new Local
        {
            Nome = nomeFormatado,
            Capacidade = dto.Capacidade,
            Ativo = true
        };

        await _localRepository.AdicionarAsync(novoLocal);
        await _localRepository.SalvarAlteracoesAsync();

        return new LocalResponseDto { Id = novoLocal.Id, Nome = novoLocal.Nome, Capacidade = novoLocal.Capacidade };
    }

    public async Task<IEnumerable<LocalResponseDto>> ListarLocaisAsync()
    {
        var locais = await _localRepository.ListarAtivosAsync();
        return locais.Select(l => new LocalResponseDto { Id = l.Id, Nome = l.Nome, Capacidade = l.Capacidade });
    }

    public async Task<LocalResponseDto> ObterLocalPorIdAsync(long id)
    {
        var local = await _localRepository.ObterPorIdAsync(id);
        
        if (local == null)
            throw new NotFoundException("Local não encontrado.");

        return new LocalResponseDto { Id = local.Id, Nome = local.Nome, Capacidade = local.Capacidade };
    }

    public async Task<LocalResponseDto> AtualizarLocalAsync(long id, LocalUpdateDto dto)
    {
        var local = await _localRepository.ObterPorIdAsync(id);
        if (local == null)
            throw new NotFoundException("Local não encontrado.");

        var nomeFormatado = dto.Nome.Trim();
        var nomeEmUso = await _localRepository.VerificarNomeEmUsoAsync(nomeFormatado, id);
        
        if (nomeEmUso)
            throw new BusinessRuleException("Já existe outro local utilizando este nome.");

        local.Nome = nomeFormatado;
        local.Capacidade = dto.Capacidade;

        await _localRepository.AtualizarAsync(local);
        await _localRepository.SalvarAlteracoesAsync();

        return new LocalResponseDto { Id = local.Id, Nome = local.Nome, Capacidade = local.Capacidade };
    }

    public async Task DeletarLocalAsync(long id)
    {
        var local = await _localRepository.ObterPorIdAsync(id);
        if (local == null)
            throw new NotFoundException("Local não encontrado.");

        var possuiReservas = await _localRepository.PossuiReservasFuturasAsync(id);
        if (possuiReservas)
            throw new BusinessRuleException("Não é possível excluir este local, pois existem reservas futuras ativas para ele.");

        local.Ativo = false;
        
        await _localRepository.AtualizarAsync(local);
        await _localRepository.SalvarAlteracoesAsync();
    }
}