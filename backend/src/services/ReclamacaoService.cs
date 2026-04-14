using backend.src.context;
using backend.src.dtos.Reclamacao;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;
using backend.src.constants;
using backend.src.exceptions;

namespace backend.src.services;

public class ReclamacaoService : IReclamacaoService
{
    private readonly IReclamacaoRepository _reclamacaoRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly AppDbContext _context;
    private readonly ICacheService _cacheService;

    // Chaves de identificação para o armazenamento
    private const string CACHE_KEY_TODAS_RECLAMACOES = "reclamacoes:admin:todas";
    private const string CACHE_KEY_RECLAMACOES_PUBLICAS = "reclamacoes:publicas:todas";
    private static string ObterChaveCacheUsuario(long userId) => $"reclamacoes:usuario:{userId}";

    public ReclamacaoService(
        IReclamacaoRepository reclamacaoRepository,
        IMoradorRepository moradorRepository,
        AppDbContext context,
        ICacheService cacheService)
    {
        _reclamacaoRepository = reclamacaoRepository;
        _moradorRepository = moradorRepository;
        _context = context;
        _cacheService = cacheService;
    }

    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync(long? userIdLogado = null)
    {
        await _cacheService.RemoveAsync(CACHE_KEY_TODAS_RECLAMACOES);
        await _cacheService.RemoveAsync(CACHE_KEY_RECLAMACOES_PUBLICAS);

        if (userIdLogado.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheUsuario(userIdLogado.Value));
        }
    }

    // ---------------- Lógica de Leitura (Com Cache) ----------------

    public async Task<IEnumerable<ReclamacaoResponseDto>> ListarMinhasReclamacoesAsync(long userId)
    {
        string cacheKey = ObterChaveCacheUsuario(userId);
        var cachedData = await _cacheService.GetAsync<IEnumerable<ReclamacaoResponseDto>>(cacheKey);
        if (cachedData != null) return cachedData;

        var morador = await _moradorRepository.ObterPorIdUserAsync(userId);
        if (morador == null)
            throw new UnauthorizedAccessException("Morador não encontrado.");

        var reclamacoes = await _reclamacaoRepository.ListarAtivasPorMoradorAsync(morador.Id);
        var resultado = reclamacoes.Select(r => MapearParaDto(r)).ToList();

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromHours(12));

        return resultado;
    }

    public async Task<IEnumerable<ReclamacaoResponseDto>> ListarTodasReclamacoesAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<ReclamacaoResponseDto>>(CACHE_KEY_TODAS_RECLAMACOES);
        if (cachedData != null) return cachedData;

        var reclamacoes = await _reclamacaoRepository.ListarTodasAtivasAsync();
        var resultado = reclamacoes.Select(r => MapearParaDto(r)).ToList();

        await _cacheService.SetAsync(CACHE_KEY_TODAS_RECLAMACOES, resultado, TimeSpan.FromHours(12));

        return resultado;
    }

    public async Task<IEnumerable<ReclamacaoPublicaDto>> ListarTodasReclamacoesPublicasAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<ReclamacaoPublicaDto>>(CACHE_KEY_RECLAMACOES_PUBLICAS);
        if (cachedData != null) return cachedData;

        var reclamacoes = await _reclamacaoRepository.ListarTodasAtivasAsync();
        var resultado = reclamacoes.Select(r => new ReclamacaoPublicaDto
        {
            Id = r.Id,
            Titulo = r.Titulo,
            Descricao = r.Descricao,
            Status = r.Categoria?.Nome ?? "Status Indefinido"
        }).ToList();

        await _cacheService.SetAsync(CACHE_KEY_RECLAMACOES_PUBLICAS, resultado, TimeSpan.FromHours(12));

        return resultado;
    }
    
    // ---------------- Lógica do Morador (Com Invalidação) ----------------

    public async Task<ReclamacaoResponseDto> CriarReclamacaoAsync(ReclamacaoCreateDto dto, long userId)
    {
        var morador = await _moradorRepository.ObterPorIdUserAsync(userId);
        if (morador == null)
            throw new UnauthorizedAccessException("Apenas moradores podem criar reclamações.");

        var novaReclamacao = new Reclamacao
        {
            IdMorador = morador.Id,
            Titulo = dto.Titulo.Trim(),
            Descricao = dto.Descricao.Trim(),
            IdCategoriaReclamacao = CategoriaReclamacaoConstants.ABERTA_ID,
            Ativo = true
        };

        await _reclamacaoRepository.AdicionarAsync(novaReclamacao);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(userId);

        var reclamacaoSalva = await _reclamacaoRepository.ObterPorIdAsync(novaReclamacao.Id);
        return MapearParaDto(reclamacaoSalva!);
    }

    public async Task<ReclamacaoResponseDto> AtualizarReclamacaoAsync(long id, long userId, ReclamacaoUpdateDto dto)
    {
        var reclamacao = await _reclamacaoRepository.ObterPorIdAsync(id);

        if (reclamacao == null)
            throw new NotFoundException("Reclamação não encontrada.");

        if (reclamacao.Morador?.IdUser != userId)
            throw new UnauthorizedAccessException("Você só pode alterar suas próprias reclamações.");

        reclamacao.Titulo = dto.Titulo.Trim();
        reclamacao.Descricao = dto.Descricao.Trim();

        await _reclamacaoRepository.AtualizarAsync(reclamacao);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(userId);

        return MapearParaDto(reclamacao);
    }

    public async Task CancelarReclamacaoAsync(long id, long userId)
    {
        var reclamacao = await _reclamacaoRepository.ObterPorIdAsync(id);

        if (reclamacao == null)
            throw new NotFoundException("Reclamação não encontrada.");

        if (reclamacao.Morador?.IdUser != userId)
            throw new UnauthorizedAccessException("Você só pode deletar suas próprias reclamações.");

        await _reclamacaoRepository.DeletarAsync(reclamacao);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(userId);
    }

    // ---------------- Admin (Com Invalidação) ----------------

    public async Task<ReclamacaoResponseDto> AtualizarReclamacaoAdminAsync(long id, long adminId, ReclamacaoAdminUpdateDto dto)
    {
        var reclamacao = await _reclamacaoRepository.ObterPorIdAsync(id);

        if (reclamacao == null)
            throw new NotFoundException("Reclamação não encontrada.");

        reclamacao.Titulo = dto.Titulo.Trim();
        reclamacao.Descricao = dto.Descricao.Trim();
        reclamacao.IdCategoriaReclamacao = dto.IdCategoriaReclamacao; 

        await _reclamacaoRepository.AtualizarAsync(reclamacao);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(reclamacao.Morador?.IdUser);

        return MapearParaDto(reclamacao);
    }

    public async Task CancelarReclamacaoAdminAsync(long id, long adminId)
    {
        var reclamacao = await _reclamacaoRepository.ObterPorIdAsync(id);
        
        if (reclamacao == null)
            throw new NotFoundException("Reclamação não encontrada.");

        await _reclamacaoRepository.DeletarAsync(reclamacao);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(reclamacao.Morador?.IdUser);
    }

    // ---------------- Método Auxiliar ----------------

    static private ReclamacaoResponseDto MapearParaDto(Reclamacao r)
    {
        return new ReclamacaoResponseDto
        {
            Id = r.Id,
            Titulo = r.Titulo,
            Descricao = r.Descricao,
            MoradorId = r.IdMorador,
            NomeMorador = r.Morador?.Usuario?.Nome ?? string.Empty,
            BlocoApartamento = $"{r.Morador?.Bloco} - Apt {r.Morador?.Apartamento}",
            Status = r.Categoria?.Nome ?? string.Empty
        };
    }
}