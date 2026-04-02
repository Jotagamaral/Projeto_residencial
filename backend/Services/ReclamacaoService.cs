using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;
using backend.Constants;
using backend.Exceptions;

namespace backend.Services;

public class ReclamacaoService : IReclamacaoService
{
    private readonly IReclamacaoRepository _reclamacaoRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly AppDbContext _context;

    public ReclamacaoService(
        IReclamacaoRepository reclamacaoRepository,
        IMoradorRepository moradorRepository,
        AppDbContext context)
    {
        _reclamacaoRepository = reclamacaoRepository;
        _moradorRepository = moradorRepository;
        _context = context;
    }

    // ---------------- Lógica de Leitura ----------------

    public async Task<IEnumerable<ReclamacaoResponseDto>> ListarMinhasReclamacoesAsync(long userId)
    {
        var morador = await _moradorRepository.ObterPorIdUserAsync(userId);
        if (morador == null)
            throw new UnauthorizedAccessException("Morador não encontrado.");

        var reclamacoes = await _reclamacaoRepository.ListarAtivasPorMoradorAsync(morador.Id);
        
        return reclamacoes.Select(r => MapearParaDto(r));
    }

    public async Task<IEnumerable<ReclamacaoResponseDto>> ListarTodasReclamacoesAsync()
    {
        var reclamacoes = await _reclamacaoRepository.ListarTodasAtivasAsync();
        return reclamacoes.Select(r => MapearParaDto(r));
    }

    public async Task<IEnumerable<ReclamacaoPublicaDto>> ListarTodasReclamacoesPublicasAsync()
{
    var reclamacoes = await _reclamacaoRepository.ListarTodasAtivasAsync();
    
    return reclamacoes.Select(r => new ReclamacaoPublicaDto
    {
        Id = r.Id,
        Titulo = r.Titulo,
        Descricao = r.Descricao,
        Status = r.Categoria?.Nome ?? "Status Indefinido"
    });
}
    
    // ---------------- Lógica do Morador ----------------

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

        // Busca novamente para popular os Includes (Morador e Categoria)
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
    }

    // ---------------- Admin ----------------

    public async Task<ReclamacaoResponseDto> AtualizarReclamacaoAdminAsync(long id, long adminId, ReclamacaoAdminUpdateDto dto)
    {
        var reclamacao = await _reclamacaoRepository.ObterPorIdAsync(id);

        if (reclamacao == null)
            throw new NotFoundException("Reclamação não encontrada.");

        reclamacao.Titulo = dto.Titulo.Trim();
        reclamacao.Descricao = dto.Descricao.Trim();
        reclamacao.IdCategoriaReclamacao = dto.IdCategoriaReclamacao; // Admin altera o status

        await _reclamacaoRepository.AtualizarAsync(reclamacao);
        await _context.SaveChangesAsync();

        return MapearParaDto(reclamacao);
    }

    public async Task CancelarReclamacaoAdminAsync(long id, long adminId)
    {
        var reclamacao = await _reclamacaoRepository.ObterPorIdAsync(id);
        
        if (reclamacao == null)
            throw new NotFoundException("Reclamação não encontrada.");

        await _reclamacaoRepository.DeletarAsync(reclamacao);
        await _context.SaveChangesAsync();
    }

    // ---------------- Método Auxiliar ----------------

    private ReclamacaoResponseDto MapearParaDto(Reclamacao r)
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