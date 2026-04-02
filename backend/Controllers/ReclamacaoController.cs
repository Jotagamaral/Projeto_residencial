using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Constants;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Gestão de Reclamações")]
public class ReclamacaoController : ControllerBase
{
    private readonly IReclamacaoService _reclamacaoService;

    public ReclamacaoController(IReclamacaoService reclamacaoService)
    {
        _reclamacaoService = reclamacaoService;
    }

    // ---------------- CREATE ----------------
    
    /// <summary>
    /// Cria uma nova reclamação para o morador autenticado.
    /// </summary>
    /// <remarks>
    /// O ID do Morador é extraído automaticamente do Token JWT.
    /// Não é necessário enviar quem está reservando no corpo da requisição.
    /// </remarks>
    /// <returns>Retorna os detalhes da reclamação confirmada.</returns>
    [HttpPost("criar-reclamacao")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CriarReclamacao([FromBody] ReclamacaoCreateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _reclamacaoService.CriarReclamacaoAsync(dto, userId);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    // ---------------- READ ----------------

    /// <summary>
    /// Lista apenas as reclamações do morador autenticado.
    /// </summary>
    [HttpGet("minhas-reclamacoes")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarMinhasReclamacoes()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var reclamacoes = await _reclamacaoService.ListarMinhasReclamacoesAsync(userId);
        return Ok(reclamacoes);
    }

    /// <summary>
    /// (Admin) Lista todas as reclamações do condomínio.
    /// </summary>
    [HttpGet("admin-reclamacoes")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodasReclamacoesAdmin()
    {
        var reclamacoes = await _reclamacaoService.ListarTodasReclamacoesAsync();
        return Ok(reclamacoes);
    }

    /// <summary>
    /// Lista todas as reclamações do condomínio de forma anônima.
    /// </summary>
    [HttpGet("todas-reclamacoes")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.MORADOR_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoPublicaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodasReclamacoesPublicas()
    {
        var reclamacoes = await _reclamacaoService.ListarTodasReclamacoesPublicasAsync();
        return Ok(reclamacoes);
    }

    // ---------------- UPDATE ----------------

    /// <summary>
    /// Atualiza reclamação do morador autenticado.
    /// </summary>
    [HttpPut("atualizar-reclamacao/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarReclamacao(long id, [FromBody] ReclamacaoUpdateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _reclamacaoService.AtualizarReclamacaoAsync(id, userId, dto);
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin) Atualiza qualquer reclamação do sistema.
    /// </summary>
    [HttpPut("admin-atualizar-reclamacao/{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarReclamacaoAdmin(long id, [FromBody] ReclamacaoAdminUpdateDto dto)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminId))
            return Unauthorized(new { message = "Administrador não autenticado." });

        var resultado = await _reclamacaoService.AtualizarReclamacaoAdminAsync(id, adminId, dto);
        return Ok(resultado);
    }

    // ---------------- DELETE ----------------

    /// <summary>
    /// Deleta uma reclamação existente do morador autenticado.
    /// </summary>
    [HttpDelete("delete-reclamacao/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeletarReclamacao(long id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        await _reclamacaoService.CancelarReclamacaoAsync(id, userId);
        return NoContent();
    }

    /// <summary>
    /// (Admin) Deleta qualquer reclamação do sistema.
    /// </summary>
    [HttpDelete("admin-delete-reclamacao/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeletarReclamacaoAdmin(long id)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminId))
            return Unauthorized(new { message = "Administrador não autenticado." });

        await _reclamacaoService.CancelarReclamacaoAdminAsync(id, adminId);
        return NoContent();
    }
}