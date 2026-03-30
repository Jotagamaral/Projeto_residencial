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
    private readonly AppDbContext _context;

    public EncomendaService(
        IEncomendaRepository encomendaRepository,
        IFuncionarioRepository funcionarioRepository,
        AppDbContext context)
    {
        _encomendaRepository = encomendaRepository;
        _funcionarioRepository = funcionarioRepository;
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

    public async Task<EncomendaResponseDto> CriarEncomendaAsync(EncomendaCreateDto dto, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId);
        if (funcionario == null)
            throw new UnauthorizedAccessException("Apenas operadores válidos podem registrar encomendas.");

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
            FuncionarioId = novaEncomenda.IdFuncionario,
            Funcionario = funcionario.Usuario?.Nome ?? string.Empty,
            DataRecebido = novaEncomenda.DataRecebido,
            Status = CategoriaEncomendaConstants.PENDENTE_STRING
        };
    }

    public async Task<EncomendaResponseDto> AtualizarEncomendaAsync(long id, EncomendaUpdateDto dto, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId);
        if (funcionario == null)
            throw new UnauthorizedAccessException("Operador inválido.");

        var encomenda = await _encomendaRepository.ObterPorIdAsync(id);
        if (encomenda == null)
            throw new KeyNotFoundException("Encomenda não encontrada.");

        encomenda.IdCategoriaEncomenda = dto.IdCategoriaEncomenda;
        
        if (!string.IsNullOrWhiteSpace(dto.Remetente))
            encomenda.Remetente = dto.Remetente.Trim();

        if (dto.DataRetirado.HasValue)
            encomenda.DataRetirado = dto.DataRetirado.Value.ToUniversalTime();

        await _encomendaRepository.AtualizarAsync(encomenda);
        await _context.SaveChangesAsync();

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
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId);
        if (funcionario == null)
            throw new UnauthorizedAccessException("Operador inválido.");

        var encomenda = await _encomendaRepository.ObterPorIdAsync(id);
        if (encomenda == null)
            throw new KeyNotFoundException("Encomenda não encontrada.");

        encomenda.IdCategoriaEncomenda = retirada
            ? CategoriaEncomendaConstants.ENTREGUE_ID
            : CategoriaEncomendaConstants.PENDENTE_ID;

        encomenda.DataRetirado = retirada
            ? DateTime.UtcNow
            : null;

        await _encomendaRepository.AtualizarAsync(encomenda);
        await _context.SaveChangesAsync();

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

    public async Task CancelarEncomendaAsync(long id, long operadorId)
    {
        var funcionario = await _funcionarioRepository.ObterPorIdUserAsync(operadorId);
        if (funcionario == null)
            throw new UnauthorizedAccessException("Operador inválido.");

        var encomenda = await _encomendaRepository.ObterPorIdAsync(id);
        if (encomenda == null)
            throw new KeyNotFoundException("Encomenda não encontrada.");

        await _encomendaRepository.DeletarAsync(encomenda);
        await _context.SaveChangesAsync();
    }
}