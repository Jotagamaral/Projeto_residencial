using backend.src.constants;
using backend.src.context;
using backend.src.dtos.Encomenda;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;
using backend.src.exceptions;

namespace backend.src.services;

public class EncomendaService(
    IEncomendaRepository _encomendaRepository,
    IMoradorRepository _moradorRepository,
    IFuncionarioRepository _funcionarioRepository,
    AppDbContext _context,
    ICacheService _cacheService) : IEncomendaService
{
    // Chaves de identificação estruturadas para o cache
    private const string CACHE_KEY_TODAS_ENCOMENDAS = "encomendas:ativas:todas";
    private static string ObterChaveCacheMorador(long idMorador) => $"encomendas:morador:{idMorador}";
    
    // ---------------- Lógica de Invalidação ----------------

    private async Task InvalidarCachesAfetadosAsync(long? idMorador = null)
    {
        await _cacheService.RemoveAsync(CACHE_KEY_TODAS_ENCOMENDAS);
        
        if (idMorador.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheMorador(idMorador.Value));
        }
    }

    // --------------------------- CREATE ---------------------------
    
    public async Task<EncomendaResponseDto> CriarEncomendaAsync(EncomendaCreateDto dto, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId)
            ?? throw new UnauthorizedAccessException("Apenas operadores válidos podem registrar encomendas.");

        if (string.IsNullOrWhiteSpace(dto.Remetente))
            throw new BusinessRuleException("O remetente é obrigatório para registrar a encomenda.");

        var novaEncomenda = new Encomenda
        {
            IdMorador = dto.MoradorId,
            IdFuncionario = funcionario.Id,
            Remetente = dto.Remetente.Trim(),
            IdCategoriaEncomenda = CategoriaEncomendaConstants.PENDENTE_ID,
            DataRecebido = DateTime.UtcNow,
            DataRetirado = null,
            Ativo = true
        };

        await _encomendaRepository.AdicionarAsync(novaEncomenda);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(novaEncomenda.IdMorador);

        return new EncomendaResponseDto
        {
            Id = novaEncomenda.Id,
            Remetente = novaEncomenda.Remetente,
            MoradorId = novaEncomenda.IdMorador,
            FuncionarioId = novaEncomenda.IdFuncionario,
            Funcionario = funcionario.Usuario?.Nome ?? string.Empty,
            DataRecebido = novaEncomenda.DataRecebido,
            Status = CategoriaEncomendaConstants.PENDENTE_STRING
        };
    }

    // --------------------------- READ ---------------------------
    
    public async Task<IEnumerable<EncomendaResponseDto>> ListarEncomendasAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<EncomendaResponseDto>>(CACHE_KEY_TODAS_ENCOMENDAS);
        if (cachedData != null) return cachedData;

        var encomendas = await _encomendaRepository.ListarAtivasAsync();
        
        var resultado = encomendas.Select(e => new EncomendaResponseDto
        {
            Id = e.Id,
            Remetente = e.Remetente,
            MoradorId = e.IdMorador,
            Morador = e.Morador?.Usuario?.Nome ?? string.Empty,
            Apartamento = e.Morador?.Apartamento,
            FuncionarioId = e.IdFuncionario,
            Funcionario = e.Funcionario?.Usuario?.Nome ?? string.Empty,
            DataRecebido = e.DataRecebido,
            DataRetirado = e.DataRetirado,
            Status = e.Categoria?.Nome ?? CategoriaEncomendaConstants.PENDENTE_STRING
        }).ToList();

        await _cacheService.SetAsync(CACHE_KEY_TODAS_ENCOMENDAS, resultado, TimeSpan.FromHours(8));

        return resultado;
    }

    public async Task<IEnumerable<EncomendaResponseDto>> ListarMinhasEncomendasAsync(long userId)
    {
        var morador = await _moradorRepository.ObterPorIdUserAsync(userId)
            ?? throw new UnauthorizedAccessException("Perfil de morador não encontrado.");

        string cacheKey = ObterChaveCacheMorador(morador.Id);
        var cachedData = await _cacheService.GetAsync<IEnumerable<EncomendaResponseDto>>(cacheKey);
        if (cachedData != null) return cachedData;

        var encomendas = await _encomendaRepository.ListarPorMoradorAsync(morador.Id);

        var resultado = encomendas.Select(e => new EncomendaResponseDto
        {
            Id = e.Id,
            Remetente = e.Remetente,
            MoradorId = e.IdMorador,
            Morador = e.Morador?.Usuario?.Nome ?? string.Empty,
            Apartamento = e.Morador?.Apartamento,
            FuncionarioId = e.IdFuncionario,
            Funcionario = e.Funcionario?.Usuario?.Nome ?? string.Empty,
            DataRecebido = e.DataRecebido,
            DataRetirado = e.DataRetirado,
            Status = e.Categoria?.Nome ?? "Pendente"
        }).ToList();

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromHours(8));

        return resultado;
    }

    // --------------------------- UPDATE ---------------------------
    
    public async Task<EncomendaResponseDto> AtualizarEncomendaAsync(long id, EncomendaUpdateDto dto, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId)
            ?? throw new UnauthorizedAccessException("Operador inválido.");

        var encomenda = await _encomendaRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("A encomenda solicitada não foi encontrada.");

        encomenda.IdCategoriaEncomenda = dto.IdCategoriaEncomenda;
        
        if (!string.IsNullOrWhiteSpace(dto.Remetente))
            encomenda.Remetente = dto.Remetente.Trim();

        if (dto.DataRetirado.HasValue)
            encomenda.DataRetirado = dto.DataRetirado.Value.ToUniversalTime();

        await _encomendaRepository.AtualizarAsync(encomenda);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(encomenda.IdMorador);

        return new EncomendaResponseDto
        {
            Id = encomenda.Id,
            Remetente = encomenda.Remetente,
            MoradorId = encomenda.IdMorador,
            Morador = encomenda.Morador?.Usuario?.Nome ?? string.Empty,
            Apartamento = encomenda.Morador?.Apartamento,
            FuncionarioId = encomenda.IdFuncionario,
            Funcionario = encomenda.Funcionario?.Usuario?.Nome ?? string.Empty,
            DataRecebido = encomenda.DataRecebido,
            DataRetirado = encomenda.DataRetirado,
            Status = encomenda.Categoria?.Nome ?? string.Empty
        };
    }

    public async Task<EncomendaResponseDto> AtualizarRetiradaAsync(long id, bool retirada, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId)
            ?? throw new UnauthorizedAccessException("Operador inválido.");

        var encomenda = await _encomendaRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("A encomenda solicitada não foi encontrada.");

        encomenda.IdCategoriaEncomenda = retirada
            ? CategoriaEncomendaConstants.ENTREGUE_ID
            : CategoriaEncomendaConstants.PENDENTE_ID;

        encomenda.DataRetirado = retirada
            ? DateTime.UtcNow
            : null;

        await _encomendaRepository.AtualizarAsync(encomenda);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(encomenda.IdMorador);

        return new EncomendaResponseDto
        {
            Id = encomenda.Id,
            Remetente = encomenda.Remetente,
            MoradorId = encomenda.IdMorador,
            Morador = encomenda.Morador?.Usuario?.Nome ?? string.Empty,
            Apartamento = encomenda.Morador?.Apartamento,
            FuncionarioId = encomenda.IdFuncionario,
            Funcionario = encomenda.Funcionario?.Usuario?.Nome ?? string.Empty,
            DataRecebido = encomenda.DataRecebido,
            DataRetirado = encomenda.DataRetirado,
            Status = retirada
                ? CategoriaEncomendaConstants.ENTREGUE_STRING
                : CategoriaEncomendaConstants.PENDENTE_STRING
        };
    }

    // --------------------------- DELETE ---------------------------
    
    public async Task CancelarEncomendaAsync(long id, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId)
            ?? throw new UnauthorizedAccessException("Operador inválido.");

        var encomenda = await _encomendaRepository.ObterPorIdAsync(id)
            ?? throw new NotFoundException("A encomenda que você tentou cancelar não existe.");

        await _encomendaRepository.DeletarAsync(encomenda);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(encomenda.IdMorador);
    }
}