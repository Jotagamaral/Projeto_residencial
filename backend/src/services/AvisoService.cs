using backend.src.context;
using backend.src.dtos.Aviso;
using backend.src.exceptions;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;

namespace backend.src.services;

public class AvisoService(
    IAvisoRepository _avisoRepository, 
    AppDbContext _context,
    ICacheService _cacheService) : IAvisoService
{
    // Nomenclatura hierárquica baseada em namespaces
    private const string CACHE_KEY_AVISOS_ATIVOS = "aviso:ativos:todos";
    private const string CACHE_KEY_AVISOS_GESTAO = "aviso:gestao:todos";

    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync()
    {
        await _cacheService.RemoveAsync(CACHE_KEY_AVISOS_ATIVOS);
        await _cacheService.RemoveAsync(CACHE_KEY_AVISOS_GESTAO);
    }

    // ---------------- Lógica de Criação ----------------

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

        // Invalida os caches
        await InvalidarCachesAfetadosAsync();

        return MapearParaDto(entidade);
    }

    // ---------------- Lógica de Leitura ----------------

    public async Task<IReadOnlyList<AvisoResponseDto>> ListarAtivosAsync()
    {
        var cachedData = await _cacheService.GetAsync<IReadOnlyList<AvisoResponseDto>>(CACHE_KEY_AVISOS_ATIVOS);
        if (cachedData != null) return cachedData;

        var lista = await _avisoRepository.ListarAtivosNaoExpiradosAsync(DateTime.UtcNow);
        var resultado = lista.Select(MapearParaDto).ToList();

        await _cacheService.SetAsync(CACHE_KEY_AVISOS_ATIVOS, resultado, TimeSpan.FromHours(1));

        return resultado;
    }

    public async Task<IReadOnlyList<AvisoResponseDto>> ListarTodosGestaoAsync()
    {
        var cachedData = await _cacheService.GetAsync<IReadOnlyList<AvisoResponseDto>>(CACHE_KEY_AVISOS_GESTAO);
        if (cachedData != null) return cachedData;

        var lista = await _avisoRepository.ListarTodosAsync();
        var resultado = lista.Select(MapearParaDto).ToList();

        await _cacheService.SetAsync(CACHE_KEY_AVISOS_GESTAO, resultado, TimeSpan.FromHours(12));

        return resultado;
    }

    // ---------------- Lógica de Atualização ----------------

    public async Task<AvisoResponseDto> AtualizarAsync(long id, AvisoUpdateDto dto)
    {
        var aviso = await _avisoRepository.ObterPorIdTrackedAsync(id)
            ?? throw new NotFoundException("Aviso não encontrado.");

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

        // Invalida os caches após a alteração
        await InvalidarCachesAfetadosAsync();

        return MapearParaDto(aviso);
    }

    public async Task<AvisoResponseDto> DefinirAtivoAsync(long id, bool ativo)
    {
        var aviso = await _avisoRepository.ObterPorIdTrackedAsync(id)
            ?? throw new NotFoundException("Aviso não encontrado.");

        aviso.Ativo = ativo;
        await _context.SaveChangesAsync();

        // Invalida os caches
        await InvalidarCachesAfetadosAsync();

        return MapearParaDto(aviso);
    }

    // ---------------- Método Auxiliar ----------------

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