using backend.Data;
using backend.DTOs;
using backend.Exceptions;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services;

public class AvisoService : IAvisoService
{
    private readonly IAvisoRepository _avisoRepository;
    private readonly AppDbContext _context;

    public AvisoService(IAvisoRepository avisoRepository, AppDbContext context)
    {
        _avisoRepository = avisoRepository;
        _context = context;
    }

    public async Task<AvisoResponseDto> CriarAsync(AvisoCreateDto dto, long idUsuario)
    {
        var inicio = DateTime.UtcNow;
        var diaExpiracao = dto.DataExpiracao.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(dto.DataExpiracao.Date, DateTimeKind.Utc)
            : dto.DataExpiracao.ToUniversalTime().Date;
        var fimDoDiaUtc = diaExpiracao.AddDays(1).AddTicks(-1);

        if (fimDoDiaUtc < inicio)
            throw new BusinessRuleException("A data de expiração deve ser posterior ao momento atual.");

        var entidade = new Aviso
        {
            IdUser = idUsuario,
            Titulo = dto.Titulo.Trim(),
            Descricao = dto.Descricao.Trim(),
            DataInicio = inicio,
            DataExpiracao = fimDoDiaUtc,
            Ativo = true,
        };

        await _avisoRepository.AdicionarAsync(entidade);
        await _context.SaveChangesAsync();

        return MapearParaDto(entidade);
    }

    public async Task<IReadOnlyList<AvisoResponseDto>> ListarAtivosAsync()
    {
        var lista = await _avisoRepository.ListarAtivosNaoExpiradosAsync(DateTime.UtcNow);
        return lista.Select(MapearParaDto).ToList();
    }

    public async Task<IReadOnlyList<AvisoResponseDto>> ListarTodosGestaoAsync()
    {
        var lista = await _avisoRepository.ListarTodosAsync();
        return lista.Select(MapearParaDto).ToList();
    }

    public async Task<AvisoResponseDto> AtualizarAsync(long id, AvisoUpdateDto dto)
    {
        var aviso = await _avisoRepository.ObterPorIdTrackedAsync(id);
        if (aviso == null)
            throw new NotFoundException("Aviso não encontrado.");

        var diaExpiracao = dto.DataExpiracao.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(dto.DataExpiracao.Date, DateTimeKind.Utc)
            : dto.DataExpiracao.ToUniversalTime().Date;
        var fimDoDiaUtc = diaExpiracao.AddDays(1).AddTicks(-1);

        if (aviso.DataInicio.HasValue && fimDoDiaUtc < aviso.DataInicio.Value)
            throw new BusinessRuleException("A data de expiração não pode ser anterior à data de publicação do aviso.");

        aviso.Titulo = dto.Titulo.Trim();
        aviso.Descricao = dto.Descricao.Trim();
        aviso.DataExpiracao = fimDoDiaUtc;
        aviso.Ativo = dto.Ativo;

        await _context.SaveChangesAsync();

        return MapearParaDto(aviso);
    }

    public async Task<AvisoResponseDto> DefinirAtivoAsync(long id, bool ativo)
    {
        var aviso = await _avisoRepository.ObterPorIdTrackedAsync(id);
        if (aviso == null)
            throw new NotFoundException("Aviso não encontrado.");

        aviso.Ativo = ativo;
        await _context.SaveChangesAsync();

        return MapearParaDto(aviso);
    }

    private static AvisoResponseDto MapearParaDto(Aviso a) => new()
    {
        Id = a.Id,
        Titulo = a.Titulo,
        Descricao = a.Descricao,
        DataInicio = a.DataInicio,
        DataExpiracao = a.DataExpiracao,
        Ativo = a.Ativo,
    };
}
