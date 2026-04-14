using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using backend.src.dtos.Reserva;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;
using backend.src.context;
using backend.src.constants;
using backend.src.exceptions;

namespace backend.src.services;

public class ReservaService(
    IReservaRepository _reservaRepository,
    IMoradorRepository _moradorRepository,
    IHttpContextAccessor _httpContextAccessor,
    AppDbContext _context,
    ICacheService _cacheService) : IReservaService
{
    // Constantes para chaves de cache no Redis
    private const string CACHE_KEY_OCUPACOES = "reservas:ocupacoes:ativas";
    private const string CACHE_KEY_TODAS_RESERVAS = "reservas:admin:todas";
    private static string ObterChaveCacheUsuario(long userId) => $"reservas:usuario:{userId}";
    

    // --------------------------- MÉTODOS AUXILIARES ---------------------------
    
    private async Task InvalidarCachesAfetadosAsync(long? userIdLogado = null)
    {
        // Remove caches globais
        await _cacheService.RemoveAsync(CACHE_KEY_OCUPACOES);
        await _cacheService.RemoveAsync(CACHE_KEY_TODAS_RESERVAS);

        // Remove cache específico do usuário, se aplicável
        if (userIdLogado.HasValue)
        {
            await _cacheService.RemoveAsync(ObterChaveCacheUsuario(userIdLogado.Value));
        }
    }

    // --------------------------- CREATE ---------------------------
    
    public async Task<ReservaResponseDto> CriarReservaAdminAsync(ReservaAdminCreateDto dto, long adminIdLogado)
    {
        var dataInicioUtc = dto.DataInicio.ToUniversalTime();
        var dataFimUtc = dto.DataFim.ToUniversalTime();

        if (dataInicioUtc <= DateTime.UtcNow)
            throw new BusinessRuleException("Não é possível fazer reservas no passado.");
            
        if (dataFimUtc <= dataInicioUtc)
            throw new BusinessRuleException("A data de término deve ser posterior à data de início.");

        var morador = await _moradorRepository.ObterPorIdUserAsync(dto.IdUsuario)
            ?? throw new NotFoundException($"O usuário com ID {dto.IdUsuario} não foi encontrado ou não possui um perfil de morador.");

        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, dataInicioUtc, dataFimUtc);
        if (conflito)
            throw new BusinessRuleException("Este local já possui uma reserva confirmada para o horário selecionado.");

        var novaReserva = new Reserva
        {
            IdMorador = morador.Id,
            IdLocal = dto.IdLocal,
            DataInicio = dataInicioUtc,
            DataFim = dataFimUtc,
            IdCategoriaReserva = CategoriaReservaConstants.CONFIRMADA_ID,
            Ativo = true
        };

        await _reservaRepository.AdicionarAsync(novaReserva);
        await _context.SaveChangesAsync();

        // Invalida o cache
        await InvalidarCachesAfetadosAsync(dto.IdUsuario);

        return new ReservaResponseDto
        {
            Id = novaReserva.Id,
            IdLocal = novaReserva.IdLocal,
            DataInicio = novaReserva.DataInicio,
            DataFim = novaReserva.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        };
    }

    public async Task<ReservaResponseDto> CriarReservaAsync(ReservaCreateDto dto)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var dataInicioUtc = dto.DataInicio.ToUniversalTime();
        var dataFimUtc = dto.DataFim.ToUniversalTime();
        
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long idUser))
            throw new UnauthorizedAccessException("Usuário não autenticado ou token inválido.");

        var morador = await _moradorRepository.ObterPorIdUserAsync(idUser)
            ?? throw new UnauthorizedAccessException("Apenas moradores têm permissão para criar reservas.");
        
        if (dataInicioUtc <= DateTime.UtcNow)
            throw new BusinessRuleException("Não é possível fazer reservas no passado.");
            
        if (dataFimUtc <= dataInicioUtc)
            throw new BusinessRuleException("A data de término deve ser posterior à data de início.");

        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, dataInicioUtc, dataFimUtc);
        if (conflito)
            throw new BusinessRuleException("Este local já possui uma reserva confirmada para o horário selecionado.");

        var novaReserva = new Reserva
        {
            IdMorador = morador.Id,
            IdLocal = dto.IdLocal,
            DataInicio = dataInicioUtc,
            DataFim = dataFimUtc,
            IdCategoriaReserva = CategoriaReservaConstants.CONFIRMADA_ID,
            Ativo = true
        };

        await _reservaRepository.AdicionarAsync(novaReserva);
        await _context.SaveChangesAsync();

        // Invalida caches
        await InvalidarCachesAfetadosAsync(idUser);

        return new ReservaResponseDto
        {
            Id = novaReserva.Id,
            IdLocal = novaReserva.IdLocal,
            DataInicio = novaReserva.DataInicio,
            DataFim = novaReserva.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        };
    }

    // --------------------------- READ ---------------------------
    
    public async Task<IEnumerable<ReservaResponseDto>> ListarReservasAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<ReservaResponseDto>>(CACHE_KEY_TODAS_RESERVAS);
        if (cachedData != null) return cachedData;

        var reservas = await _reservaRepository.ListarAtivasAsync();
        var resultado = reservas.Select(r => new ReservaResponseDto
        {
            Id = r.Id,
            IdLocal = r.IdLocal,
            DataInicio = r.DataInicio,
            DataFim = r.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        }).ToList();

        await _cacheService.SetAsync(CACHE_KEY_TODAS_RESERVAS, resultado, TimeSpan.FromHours(12));

        return resultado;
    }

    public async Task<IEnumerable<ReservaResponseDto>> ListarMinhasReservasAsync(long userIdLogado)
    {
        string cacheKey = ObterChaveCacheUsuario(userIdLogado);
        var cachedData = await _cacheService.GetAsync<IEnumerable<ReservaResponseDto>>(cacheKey);
        if (cachedData != null) return cachedData;

        var morador = await _moradorRepository.ObterPorIdUserAsync(userIdLogado)
            ?? throw new UnauthorizedAccessException("Apenas moradores possuem lista de reservas.");

        var reservas = await _context.Reservas
            .Where(r => r.IdMorador == morador.Id && r.Ativo)
            .ToListAsync();

        var resultado = reservas.Select(r => new ReservaResponseDto
        {
            Id = r.Id,
            IdLocal = r.IdLocal,
            DataInicio = r.DataInicio,
            DataFim = r.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        }).ToList();

        await _cacheService.SetAsync(cacheKey, resultado, TimeSpan.FromHours(12));

        return resultado;
    }

    public async Task<IEnumerable<ReservaCalendarioDto>> ListarOcupacoesAsync()
    {
        var cachedData = await _cacheService.GetAsync<IEnumerable<ReservaCalendarioDto>>(CACHE_KEY_OCUPACOES);
        if (cachedData != null) return cachedData;

        var reservas = await _reservaRepository.ListarAtivasAsync();
        
        var resultado = reservas.Select(r => new ReservaCalendarioDto
        {
            IdLocal = r.IdLocal,
            NomeLocal = r.Local?.Nome ?? "Local Desconhecido",
            DataInicio = r.DataInicio,
            DataFim = r.DataFim
        }).ToList();

        await _cacheService.SetAsync(CACHE_KEY_OCUPACOES, resultado, TimeSpan.FromHours(12));

        return resultado;
    }

    // --------------------------- UPDATE ---------------------------
    
    public async Task<ReservaResponseDto> AtualizarReservaAsync(long reservaId, long userIdLogado, ReservaUpdateDto dto)
    {
        var morador = await _moradorRepository.ObterPorIdUserAsync(userIdLogado)
            ?? throw new UnauthorizedAccessException("Apenas moradores podem atualizar reservas.");

        var reserva = await _context.Reservas.FirstOrDefaultAsync(r => r.Id == reservaId);

        if (reserva == null || !reserva.Ativo)
            throw new NotFoundException("Reserva não encontrada ou já cancelada.");

        if (reserva.IdMorador != morador.Id)
            throw new UnauthorizedAccessException("Você só pode alterar as suas próprias reservas.");

        if (reserva.DataInicio <= DateTime.UtcNow)
            throw new BusinessRuleException("Não é possível alterar uma reserva que já iniciou ou passou.");

        var novaDataInicioUtc = dto.DataInicio.ToUniversalTime();
        var novaDataFimUtc = dto.DataFim.ToUniversalTime();

        if (novaDataInicioUtc <= DateTime.UtcNow)
            throw new BusinessRuleException("A nova data de início não pode estar no passado.");
            
        if (novaDataFimUtc <= novaDataInicioUtc)
            throw new BusinessRuleException("A data de término deve ser posterior à data de início.");

        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, novaDataInicioUtc, novaDataFimUtc, reservaId);
        if (conflito)
            throw new BusinessRuleException("Este local já possui uma reserva confirmada para o novo horário selecionado.");

        reserva.IdLocal = dto.IdLocal;
        reserva.DataInicio = novaDataInicioUtc;
        reserva.DataFim = novaDataFimUtc;

        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(userIdLogado);

        return new ReservaResponseDto
        {
            Id = reserva.Id,
            IdLocal = reserva.IdLocal,
            DataInicio = reserva.DataInicio,
            DataFim = reserva.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        };
    }

    public async Task<ReservaResponseDto> AtualizarReservaAdminAsync(long reservaId, long adminIdLogado, ReservaAdminUpdateDto dto)
    {
        var reserva = await _context.Reservas
            .Include(r => r.Morador)
            .FirstOrDefaultAsync(r => r.Id == reservaId);
        
        if (reserva == null || !reserva.Ativo)
            throw new NotFoundException("Reserva não encontrada ou já cancelada.");

        var novaDataInicioUtc = dto.DataInicio.ToUniversalTime();
        var novaDataFimUtc = dto.DataFim.ToUniversalTime();

        if (novaDataFimUtc <= novaDataInicioUtc)
            throw new BusinessRuleException("A data de término deve ser posterior à data de início.");

        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, novaDataInicioUtc, novaDataFimUtc, reservaId);
        if (conflito)
            throw new BusinessRuleException("Este local já possui uma reserva confirmada para o novo horário selecionado.");

        reserva.IdLocal = dto.IdLocal;
        reserva.DataInicio = novaDataInicioUtc;
        reserva.DataFim = novaDataFimUtc;

        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(reserva.Morador?.Id);

        return new ReservaResponseDto
        {
            Id = reserva.Id,
            IdLocal = reserva.IdLocal,
            DataInicio = reserva.DataInicio,
            DataFim = reserva.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        };
    }
    
    // --------------------------- DELETE ---------------------------
    
    public async Task CancelarReservaAsync(long reservaId, long userIdLogado)
    {
        var morador = await _moradorRepository.ObterPorIdUserAsync(userIdLogado)
            ?? throw new UnauthorizedAccessException("Perfil de morador não encontrado.");

        var reserva = await _context.Reservas.FirstOrDefaultAsync(r => r.Id == reservaId);
        
        if (reserva == null || !reserva.Ativo)
            throw new NotFoundException("Reserva não encontrada ou já cancelada.");

        if (reserva.IdMorador != morador.Id)
            throw new UnauthorizedAccessException("Você só pode cancelar as suas próprias reservas.");

        if (reserva.DataInicio <= DateTime.UtcNow)
            throw new BusinessRuleException("Não é possível cancelar uma reserva que já iniciou ou já passou.");

        reserva.Ativo = false;
        
        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(userIdLogado);
    }

    public async Task CancelarReservaAdminAsync(long reservaId, long adminIdLogado)
    {
        var reserva = await _context.Reservas
            .Include(r => r.Morador)
            .FirstOrDefaultAsync(r => r.Id == reservaId);
        
        if (reserva == null || !reserva.Ativo)
            throw new NotFoundException("Reserva não encontrada ou já cancelada.");

        reserva.Ativo = false;

        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

        await InvalidarCachesAfetadosAsync(reserva.Morador?.Id);
    }

}