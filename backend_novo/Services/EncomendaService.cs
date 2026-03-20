using System.Security.Claims;
using backend_novo.Constants;
using backend_novo.Data;
using backend_novo.DTOs;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using backend_novo.Services.Interfaces;

namespace backend_novo.Services;

public class EncomendaService : IEncomendaService
{
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IFuncionarioRepository _funcionarioRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AppDbContext _context;

    public EncomendaService(
        IEncomendaRepository encomendaRepository,
        IFuncionarioRepository funcionarioRepository,
        IHttpContextAccessor httpContextAccessor,
        AppDbContext context)
    {
        _encomendaRepository = encomendaRepository;
        _funcionarioRepository = funcionarioRepository;
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    public async Task<IEnumerable<EncomendaResponseDto>> ListarEncomendasAsync()
    {
        var encomendas = await _encomendaRepository.ListarAtivasAsync();
        return encomendas.Select(e => new EncomendaResponseDto
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
        });
    }

    public async Task<EncomendaResponseDto> CriarEncomendaAsync(EncomendaCreateDto dto)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long idUser))
            throw new UnauthorizedAccessException("Usuário não autenticado ou token inválido.");

        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(idUser);
        if (funcionario == null)
            throw new UnauthorizedAccessException("Apenas funcionários podem registrar encomendas.");

        if (string.IsNullOrWhiteSpace(dto.Remetente))
            throw new ArgumentException("O remetente é obrigatório.");

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

        return new EncomendaResponseDto
        {
            Id = novaEncomenda.Id,
            Remetente = novaEncomenda.Remetente,
            MoradorId = novaEncomenda.IdMorador,
            Morador = funcionario.Usuario?.Nome ?? string.Empty,
            FuncionarioId = novaEncomenda.IdFuncionario,
            Funcionario = funcionario.Usuario?.Nome ?? string.Empty,
            DataRecebido = novaEncomenda.DataRecebido,
            DataRetirado = novaEncomenda.DataRetirado,
            Status = CategoriaEncomendaConstants.PENDENTE_STRING
        };
    }
}
