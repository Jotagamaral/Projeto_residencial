using System.Security.Claims;
using backend_novo.DTOs;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using backend_novo.Services.Interfaces;
using backend_novo.Data;
using backend_novo.Constants;

namespace backend_novo.Services;

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

    public async Task<IEnumerable<ReservaResponseDto>> ListarReservasAsync()
    {
        var reservas = await _reservaRepository.ListarAtivasAsync();
        return reservas.Select(r => new ReservaResponseDto
        {
            Id = r.Id,
            IdLocal = r.IdLocal,
            DataInicio = r.DataInicio,
            DataFim = r.DataFim,
            Status = r.Categoria?.Nome ?? "CONFIRMADA"
        });
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
}