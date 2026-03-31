using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;
using backend.Data;
using backend.Constants;

namespace backend.Services;

public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _context;

    public ReservaService(
        IReservaRepository reservaRepository,
        IMoradorRepository moradorRepository,
        IHttpContextAccessor httpContextAccessor,
        AppDbContext context)
    {
        _reservaRepository = reservaRepository;
        _moradorRepository = moradorRepository;
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }
    // --------------------------- CREATE ---------------------------
   public async Task<ReservaResponseDto> CriarReservaAdminAsync(ReservaAdminCreateDto dto, long adminIdLogado)
{
    // Datas em UTC
    var dataInicioUtc = dto.DataInicio.ToUniversalTime();
    var dataFimUtc = dto.DataFim.ToUniversalTime();

    if (dto.DataInicio <= DateTime.Now)
        throw new ArgumentException("Não é possível fazer reservas no passado.");
        
    if (dto.DataFim <= dto.DataInicio)
        throw new ArgumentException("A data de término deve ser posterior à data de início.");

    // Validação de Integridade
    var morador = await _moradorRepository.ObterPorIdUserAsync(dto.IdUsuario);
    if (morador == null)
    {
        throw new ArgumentException($"O usuário com ID {dto.IdUsuario} não foi encontrado ou não possui um perfil de morador.");
    }

    // Validação de Conflito de Horário
    var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, dataInicioUtc, dataFimUtc);
    if (conflito)
    {
        throw new ArgumentException("Este local já possui uma reserva confirmada para o horário selecionado.");
    }

    // Criação da Entidade
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

    // Retorno mapeado
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
        // Extrair o ID_USER do Token JWT
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Datas em UTC
        var dataInicioUtc = dto.DataInicio.ToUniversalTime();
        var dataFimUtc = dto.DataFim.ToUniversalTime();
        
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long idUser))
            throw new UnauthorizedAccessException("Usuário não autenticado ou token inválido.");

        // Buscar o Morador vinculado a este Usuário
        var morador = await _moradorRepository.ObterPorIdUserAsync(idUser);
        if (morador == null)
            throw new UnauthorizedAccessException("Apenas moradores têm permissão para criar reservas.");

        // Regra de Negócio
        if (dto.DataInicio <= DateTime.Now)
            throw new ArgumentException("Não é possível fazer reservas no passado.");
            
        if (dto.DataFim <= dto.DataInicio)
            throw new ArgumentException("A data de término deve ser posterior à data de início.");

        // Validação de Conflito de Horário
        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, dataInicioUtc, dataFimUtc);
        if (conflito)
            throw new ArgumentException("Este local já possui uma reserva confirmada para o horário selecionado.");

        // Salvar no banco
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

        // 6. Retornar os dados confirmados
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
        var reservas = await _reservaRepository.ListarAtivasAsync();
        return reservas.Select(r => new ReservaResponseDto
        {
            Id = r.Id,
            IdLocal = r.IdLocal,
            DataInicio = r.DataInicio,
            DataFim = r.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        });
    }
    public async Task<IEnumerable<ReservaResponseDto>> ListarMinhasReservasAsync(long userIdLogado)
    {
        // Descobre quem é o morador a partir do ID do usuário logado
        var morador = await _moradorRepository.ObterPorIdUserAsync(userIdLogado);
        if (morador == null)
            throw new UnauthorizedAccessException("Apenas moradores possuem lista de reservas.");

        // Busca no banco apenas as reservas ativas desse morador específico
        var reservas = await _context.Reservas
            .Where(r => r.IdMorador == morador.Id && r.Ativo)
            .ToListAsync();

        return reservas.Select(r => new ReservaResponseDto
        {
            Id = r.Id,
            IdLocal = r.IdLocal,
            DataInicio = r.DataInicio,
            DataFim = r.DataFim,
            Status = CategoriaReservaConstants.CONFIRMADA_STRING
        });
    }

    public async Task<IEnumerable<ReservaCalendarioDto>> ListarOcupacoesAsync()
    {
        var reservas = await _reservaRepository.ListarAtivasAsync();
        
        return reservas.Select(r => new ReservaCalendarioDto
        {
            IdLocal = r.IdLocal,
            NomeLocal = r.Local?.Nome ?? "Local Desconhecido",
            DataInicio = r.DataInicio,
            DataFim = r.DataFim
        });
    }

    // --------------------------- UPDATE ---------------------------
    public async Task<ReservaResponseDto> AtualizarReservaAsync(long reservaId, long userIdLogado, ReservaUpdateDto dto)
    {
        // Validação de quem está pedindo
        var morador = await _moradorRepository.ObterPorIdUserAsync(userIdLogado);
        if (morador == null)
            throw new UnauthorizedAccessException("Apenas moradores podem atualizar reservas.");

        // Busca a reserva no banco
        var reserva = await _context.Reservas.FirstOrDefaultAsync(r => r.Id == reservaId);
        if (reserva == null || !reserva.Ativo)
            throw new ArgumentException("Reserva não encontrada ou já cancelada.");

        // Trava IDOR
        if (reserva.IdMorador != morador.Id)
            throw new UnauthorizedAccessException("Você só pode alterar as suas próprias reservas.");

        // Trava de Passado (Não pode alterar evento que já passou)
        if (reserva.DataInicio <= DateTime.UtcNow)
            throw new ArgumentException("Não é possível alterar uma reserva que já iniciou ou passou.");

        // Ajuste de fuso horário das novas datas
        var novaDataInicioUtc = dto.DataInicio.ToUniversalTime();
        var novaDataFimUtc = dto.DataFim.ToUniversalTime();

        if (novaDataInicioUtc <= DateTime.UtcNow)
            throw new ArgumentException("A nova data de início não pode estar no passado.");
            
        if (novaDataFimUtc <= novaDataInicioUtc)
            throw new ArgumentException("A data de término deve ser posterior à data de início.");

        // Checagem de Colisão (Passando o ID atual para ser ignorado)
        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, novaDataInicioUtc, novaDataFimUtc, reservaId);
        if (conflito)
            throw new ArgumentException("Este local já possui uma reserva confirmada para o novo horário selecionado.");

        // Efetiva a alteração
        reserva.IdLocal = dto.IdLocal;
        reserva.DataInicio = novaDataInicioUtc;
        reserva.DataFim = novaDataFimUtc;

        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

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
        var reserva = await _context.Reservas.FirstOrDefaultAsync(r => r.Id == reservaId);
        if (reserva == null || !reserva.Ativo)
            throw new ArgumentException("Reserva não encontrada ou já cancelada.");

        var novaDataInicioUtc = dto.DataInicio.ToUniversalTime();
        var novaDataFimUtc = dto.DataFim.ToUniversalTime();

        if (novaDataFimUtc <= novaDataInicioUtc)
            throw new ArgumentException("A data de término deve ser posterior à data de início.");

        // Sistema de colisão
        var conflito = await _reservaRepository.ExisteConflitoDeHorarioAsync(dto.IdLocal, novaDataInicioUtc, novaDataFimUtc, reservaId);
        if (conflito)
            throw new ArgumentException("Este local já possui uma reserva confirmada para o novo horário selecionado.");

        reserva.IdLocal = dto.IdLocal;
        reserva.DataInicio = novaDataInicioUtc;
        reserva.DataFim = novaDataFimUtc;

        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();

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
        var morador = await _moradorRepository.ObterPorIdUserAsync(userIdLogado);
        if (morador == null)
            throw new UnauthorizedAccessException("Perfil de morador não encontrado.");

        var reserva = await _context.Reservas.FirstOrDefaultAsync(r => r.Id == reservaId);
        
        if (reserva == null || !reserva.Ativo)
            throw new ArgumentException("Reserva não encontrada ou já cancelada.");

        // Garante que o morador não está apagando a reserva do vizinho
        if (reserva.IdMorador != morador.Id)
            throw new UnauthorizedAccessException("Você só pode cancelar as suas próprias reservas.");

        // Não pode cancelar reserva que já passou
        if (reserva.DataInicio <= DateTime.UtcNow)
            throw new ArgumentException("Não é possível cancelar uma reserva que já iniciou ou já passou.");

        // Exclusão Lógica
        reserva.Ativo = false;
        
        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();
    }
    public async Task CancelarReservaAdminAsync(long reservaId, long adminIdLogado)
    {
        var reserva = await _context.Reservas.FirstOrDefaultAsync(r => r.Id == reservaId);
        
        if (reserva == null || !reserva.Ativo)
            throw new ArgumentException("Reserva não encontrada ou já cancelada.");

        reserva.Ativo = false;

        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();
    }
}