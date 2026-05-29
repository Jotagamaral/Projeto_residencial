using backend.src.dtos.Visitante;
using backend.src.exceptions;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class VisitanteService(
    IVisitanteRepository _visitanteRepository,
    IAcessoVisitanteRepository _acessoRepository,
    IMoradorRepository _moradorRepository,
    IFuncionarioRepository _funcionarioRepository) : IVisitanteService
{
    public async Task<IEnumerable<VisitanteResponseDto>> ListarVisitantesAsync()
    {
        var visitantes = await _visitanteRepository.ListarAtivosAsync();
        return visitantes.Select(v => new VisitanteResponseDto
        {
            Id = v.Id, Nome = v.Nome, Cpf = v.Cpf, Rg = v.Rg, Telefone = v.Telefone, Ativo = v.Ativo
        });
    }

    public async Task<IEnumerable<VisitanteComAcessoDto>> ListarVisitantesComAcessoAsync()
    {
        var dados = await _visitanteRepository.ListarAtivosComUltimoAcessoAsync();
        return dados.Select(((Visitante v, AcessoVisitante? a) par) => new VisitanteComAcessoDto
        {
            Id = par.v.Id, Nome = par.v.Nome, Cpf = par.v.Cpf, Rg = par.v.Rg, Telefone = par.v.Telefone,
            IdAcessoAtual = par.a?.Id, IdMorador = par.a?.IdMorador, IdFuncionario = par.a?.IdFuncionario,
            DataEntrada = par.a?.DataEntrada, DataSaida = par.a?.DataSaida,
            EmAberto = par.a != null && par.a.DataSaida == null
        });
    }

    public async Task InativarVisitanteAsync(long id)
    {
        var linhasAfetadas = await _visitanteRepository.InativarPorIdAsync(id);
        if (linhasAfetadas == 0)
            throw new NotFoundException($"Visitante com ID {id} não encontrado.");
    }

    public async Task<VisitanteResponseDto> AtualizarVisitanteAsync(long id, AtualizarVisitanteDto dto)
    {
        var visitante = await _visitanteRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Visitante não encontrado.");

        visitante.Nome = dto.Nome.Trim();
        visitante.Cpf = dto.Cpf?.Trim();
        visitante.Rg = dto.Rg.Trim();
        visitante.Telefone = dto.Telefone?.Trim();

        await _visitanteRepository.AtualizarAsync(visitante);
        await _visitanteRepository.SalvarAlteracoesAsync();

        return new VisitanteResponseDto
        {
            Id = visitante.Id, Nome = visitante.Nome, Cpf = visitante.Cpf,
            Rg = visitante.Rg, Telefone = visitante.Telefone, Ativo = visitante.Ativo
        };
    }

    public async Task<AcessoVisitanteResponseDto> RegistrarAcessoExistenteAsync(long idVisitante, RegistrarAcessoExistenteDto dto)
    {
        var visitante = await _visitanteRepository.ObterPorIdAsync(idVisitante)
            ?? throw new NotFoundException("Visitante não encontrado.");

        _ = await _moradorRepository.ObterPorIdAsync(dto.IdMorador)
            ?? throw new NotFoundException("Morador não encontrado.");

        _ = await _funcionarioRepository.ObterPorIdAsync(dto.IdFuncionario)
            ?? throw new NotFoundException("Funcionário não encontrado.");

        var acesso = new AcessoVisitante
        {
            IdVisitante = visitante.Id,
            IdMorador = dto.IdMorador,
            IdFuncionario = dto.IdFuncionario,
            DataEntrada = DateTime.UtcNow,
            DataSaida = null
        };

        await _acessoRepository.AdicionarAsync(acesso);
        await _acessoRepository.SalvarAlteracoesAsync();

        return new AcessoVisitanteResponseDto
        {
            Id = acesso.Id,
            Visitante = new VisitanteResponseDto
            {
                Id = visitante.Id, Nome = visitante.Nome, Cpf = visitante.Cpf,
                Rg = visitante.Rg, Telefone = visitante.Telefone, Ativo = visitante.Ativo
            },
            IdMorador = acesso.IdMorador, IdFuncionario = acesso.IdFuncionario,
            DataEntrada = acesso.DataEntrada, DataSaida = acesso.DataSaida
        };
    }

    public async Task<AcessoVisitanteResponseDto> RegistrarEntradaAsync(RegistrarEntradaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Cpf))
            throw new BusinessRuleException("O CPF é obrigatório.");
        if (string.IsNullOrWhiteSpace(dto.Rg))
            throw new BusinessRuleException("O RG é obrigatório.");

        var morador = await _moradorRepository.ObterPorIdAsync(dto.IdMorador)
            ?? throw new NotFoundException("Morador não encontrado.");
        var funcionario = await _funcionarioRepository.ObterPorIdAsync(dto.IdFuncionario)
            ?? throw new NotFoundException("Funcionário não encontrado.");

        var visitante = await _visitanteRepository.ObterPorCpfAsync(dto.Cpf.Trim());

        if (visitante == null)
        {
            visitante = new Visitante
            {
                Cpf = dto.Cpf.Trim(), Rg = dto.Rg.Trim(),
                Nome = dto.Nome.Trim(), Telefone = dto.Telefone?.Trim(), Ativo = true
            };
            await _visitanteRepository.AdicionarAsync(visitante);
        }
        else
        {
            visitante.Ativo = true;
            visitante.Nome = dto.Nome.Trim();
            visitante.Rg = dto.Rg.Trim();
            visitante.Telefone = dto.Telefone?.Trim();
            await _visitanteRepository.AtualizarAsync(visitante);
        }
        await _visitanteRepository.SalvarAlteracoesAsync();

        var acesso = new AcessoVisitante
        {
            IdVisitante = visitante.Id, IdMorador = dto.IdMorador,
            IdFuncionario = dto.IdFuncionario, DataEntrada = DateTime.UtcNow, DataSaida = null
        };
        await _acessoRepository.AdicionarAsync(acesso);
        await _acessoRepository.SalvarAlteracoesAsync();

        return new AcessoVisitanteResponseDto
        {
            Id = acesso.Id,
            Visitante = new VisitanteResponseDto { Id = visitante.Id, Nome = visitante.Nome, Cpf = visitante.Cpf, Rg = visitante.Rg, Telefone = visitante.Telefone, Ativo = visitante.Ativo },
            IdMorador = acesso.IdMorador, IdFuncionario = acesso.IdFuncionario,
            DataEntrada = acesso.DataEntrada, DataSaida = acesso.DataSaida
        };
    }

    public async Task<AcessoVisitanteResponseDto> RegistrarSaidaAsync(long idAcesso)
    {
        var acesso = await _acessoRepository.ObterPorIdAsync(idAcesso)
            ?? throw new NotFoundException("Acesso não encontrado.");
        if (acesso.DataSaida.HasValue)
            throw new BusinessRuleException("A saída deste visitante já foi registrada.");

        acesso.DataSaida = DateTime.UtcNow;
        await _acessoRepository.AtualizarAsync(acesso);
        await _acessoRepository.SalvarAlteracoesAsync();

        return MapearAcesso(acesso);
    }

    public async Task<IEnumerable<AcessoVisitanteResponseDto>> ListarAcessosAsync()
    {
        var acessos = await _acessoRepository.ListarTodosAsync();
        return acessos.Select(MapearAcesso).ToList();
    }

    public async Task<IEnumerable<AcessoVisitanteResponseDto>> ListarAcessosEmAbertoAsync()
    {
        var acessos = await _acessoRepository.ListarAcessosEmAbertoAsync();
        return acessos.Select(MapearAcesso).ToList();
    }

    public async Task<AcessoVisitanteResponseDto> ObterAcessoPorIdAsync(long id)
    {
        var acesso = await _acessoRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("Acesso não encontrado.");
        return MapearAcesso(acesso);
    }

    private static AcessoVisitanteResponseDto MapearAcesso(AcessoVisitante a) => new()
    {
        Id = a.Id,
        Visitante = a.Visitante != null ? new VisitanteResponseDto
        {
            Id = a.Visitante.Id, Nome = a.Visitante.Nome, Cpf = a.Visitante.Cpf,
            Rg = a.Visitante.Rg, Telefone = a.Visitante.Telefone, Ativo = a.Visitante.Ativo
        } : null,
        IdMorador = a.IdMorador, IdFuncionario = a.IdFuncionario,
        DataEntrada = a.DataEntrada, DataSaida = a.DataSaida
    };
}
