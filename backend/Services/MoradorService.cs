using backend.DTOs;
using backend.Exceptions;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services;

public class MoradorService : IMoradorService
{
    private readonly IMoradorRepository _moradorRepository;

    public MoradorService(IMoradorRepository moradorRepository)
    {
        _moradorRepository = moradorRepository;
    }

    public async Task<IEnumerable<MoradorResponseDto>> ListarMoradoresAsync()
    {
        var moradores = await _moradorRepository.ListarAtivosAsync();
        
        return moradores.Select(m => new MoradorResponseDto
        {
            Id = m.Id,
            Nome = m.Usuario?.Nome ?? "Sem Nome",
            Email = m.Usuario?.Email ?? "Sem Email",
            Cpf = m.Usuario?.Cpf ?? "Sem CPF",
            Bloco = m.Bloco,
            Apartamento = m.Apartamento
        });
    }

    public async Task<MoradorResponseDto> ObterMoradorPorIdAsync(long id)
    {
        var morador = await _moradorRepository.ObterPorIdAsync(id);
        if (morador == null)
            throw new NotFoundException("Morador não encontrado.");

        return new MoradorResponseDto
        {
            Id = morador.Id,
            Nome = morador.Usuario?.Nome ?? "Sem Nome",
            Email = morador.Usuario?.Email ?? "Sem Email",
            Cpf = morador.Usuario?.Cpf ?? "Sem CPF",
            Bloco = morador.Bloco,
            Apartamento = morador.Apartamento
        };
    }

    public async Task<MoradorResponseDto> AtualizarMoradorAsync(long id, MoradorUpdateDto dto)
    {
        var morador = await _moradorRepository.ObterPorIdAsync(id);
        if (morador == null)
            throw new NotFoundException("Morador não encontrado.");

        if (string.IsNullOrWhiteSpace(dto.Bloco))
            throw new BusinessRuleException("O bloco não pode ficar em branco.");

        morador.Bloco = dto.Bloco.Trim();
        morador.Apartamento = dto.Apartamento;

        await _moradorRepository.AtualizarAsync(morador);
        await _moradorRepository.SalvarAlteracoesAsync();

        return new MoradorResponseDto
        {
            Id = morador.Id,
            Nome = morador.Usuario?.Nome ?? "Sem Nome",
            Email = morador.Usuario?.Email ?? "Sem Email",
            Cpf = morador.Usuario?.Cpf ?? "Sem CPF",
            Bloco = morador.Bloco,
            Apartamento = morador.Apartamento
        };
    }

    public async Task DeletarMoradorAsync(long id)
    {
        var morador = await _moradorRepository.ObterPorIdAsync(id);
        if (morador == null)
            throw new NotFoundException("Morador não encontrado.");

        morador.Ativo = false;
        
        
        await _moradorRepository.AtualizarAsync(morador);
        await _moradorRepository.SalvarAlteracoesAsync();
    }
}