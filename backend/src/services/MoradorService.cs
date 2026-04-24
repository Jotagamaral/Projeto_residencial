using backend.src.dtos.Morador;
using backend.src.exceptions;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class MoradorService(
    IMoradorRepository _moradorRepository, 
    ICacheService _cacheService) : IMoradorService
{

    // Chaves de identificação estruturadas para o cache
    private const string CACHE_KEY_TODOS_MORADORES = "moradores:ativos:todos";
    private static string ObterChaveCacheMorador(long id) => $"moradores:detalhe:{id}";

    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync(long? idMorador = null)
    {
        // Limpa a listagem geral sempre que houver alteração na base de moradores
        await _cacheService.RemoveAsync(CACHE_KEY_TODOS_MORADORES);
        
        // Limpa o registro individual do morador, se aplicável
        if (idMorador.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheMorador(idMorador.Value));
        }
    }

    // ---------------- Lógica de Leitura ----------------

    public async Task<IEnumerable<MoradorResponseDto>> ListarMoradoresAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<MoradorResponseDto>>(CACHE_KEY_TODOS_MORADORES);
        if (cachedData != null) return cachedData;

        var moradores = await _moradorRepository.ListarAtivosAsync();
        
        var resultado = moradores.Select(m => new MoradorResponseDto
        {
            Id = m.Id,
            Nome = m.Usuario?.Nome ?? "Sem Nome",
            Email = m.Usuario?.Email ?? "Sem Email",
            Cpf = m.Usuario?.Cpf ?? "Sem CPF",
            Bloco = m.Bloco,
            Apartamento = m.Apartamento
        }).ToList();

        await _cacheService.SetAsync(CACHE_KEY_TODOS_MORADORES, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    public async Task<MoradorResponseDto> ObterMoradorPorIdAsync(long id)
    {
        var cacheKey = ObterChaveCacheMorador(id);
        var cachedData = await _cacheService.GetAsync<MoradorResponseDto>(cacheKey);
        if (cachedData != null) return cachedData;

        var morador = await _moradorRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Morador não encontrado.");

        var resultado = new MoradorResponseDto
        {
            Id = morador.Id,
            Nome = morador.Usuario?.Nome ?? "Sem Nome",
            Email = morador.Usuario?.Email ?? "Sem Email",
            Cpf = morador.Usuario?.Cpf ?? "Sem CPF",
            Telefone = morador.Usuario?.Celular ?? "Sem Telefone",
            Bloco = morador.Bloco,
            Apartamento = morador.Apartamento
        };

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromHours(24));

        return resultado;
    }

    // ---------------- Lógica de Mutação ----------------

    public async Task<MoradorResponseDto> AtualizarMoradorAsync(long id, MoradorUpdateDto dto)
    {
        var morador = await _moradorRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Morador não encontrado.");

        if (string.IsNullOrWhiteSpace(dto.Bloco))
            throw new BusinessRuleException("O bloco não pode ficar em branco.");

        morador.Bloco = dto.Bloco.Trim();
        morador.Apartamento = dto.Apartamento;

        await _moradorRepository.AtualizarAsync(morador);
        await _moradorRepository.SalvarAlteracoesAsync();

        // Invalida os dados obsoletos
        await InvalidarCachesAfetadosAsync(id);

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
    public async Task<MoradorResponseDto> AtualizarDadosPessoaisAsync(long id, MoradorUpdateDadosPessoaisDto dto)
    {
        // Busca o morador incluindo o usuário vinculado (CSTB001_USER)
        var morador = await _moradorRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Morador não encontrado.");

        if (morador.Usuario == null)
            throw new BusinessRuleException("Dados de usuário não localizados para este morador.");

        // Atualiza os campos da tabela CSTB001_USER (Usuario)
        morador.Usuario.Nome = dto.Nome.Trim();
        morador.Usuario.Email = dto.Email.Trim();
        morador.Usuario.Cpf = dto.Cpf.Trim();
        morador.Usuario.Rg = dto.Rg?.Trim();
        morador.Usuario.Celular = dto.Telefone?.Trim(); // Mapeado para 'Celular' conforme sua DTO de criação

        // Persiste as mudanças nas tabelas
        await _moradorRepository.AtualizarAsync(morador);
        await _moradorRepository.SalvarAlteracoesAsync();

        // Limpa o cache para que a listagem reflita os novos dados pessoais
        await InvalidarCachesAfetadosAsync(id);

        return new MoradorResponseDto
        {
            Id = morador.Id,
            Nome = morador.Usuario.Nome,
            Email = morador.Usuario.Email,
            Cpf = morador.Usuario.Cpf,
            Bloco = morador.Bloco, // Mantém o dado da CSTB002_MORADOR
            Apartamento = morador.Apartamento
        };
    }

    public async Task AlterarSenhaAsync(long id, MoradorAlterarSenhaDto dto)
    {
        var morador = await _moradorRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Morador não encontrado.");

        if (morador.Usuario == null)
            throw new BusinessRuleException("Registro de usuário não encontrado.");

        // Valida a senha atual (CSTB001_USER.Senha)
        bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, morador.Usuario.Senha);
        
        if (!senhaValida)
            throw new BusinessRuleException("A senha atual está incorreta.");

        // Gera o novo hash para o campo Senha da CSTB001_USER
        morador.Usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);

        await _moradorRepository.AtualizarAsync(morador);
        await _moradorRepository.SalvarAlteracoesAsync();

        // Invalida cache se necessário
        await InvalidarCachesAfetadosAsync(id);
    }

    public async Task DeletarMoradorAsync(long id)
    {
        var morador = await _moradorRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Morador não encontrado.");

        morador.Ativo = false;
        
        await _moradorRepository.AtualizarAsync(morador);
        await _moradorRepository.SalvarAlteracoesAsync();

        // Invalida os dados obsoletos
        await InvalidarCachesAfetadosAsync(id);
    }
}