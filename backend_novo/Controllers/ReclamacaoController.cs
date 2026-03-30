using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend_novo.Constants;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;

namespace backend_novo.Controllers;

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
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized(new { message = "Usuário não autenticado." });

            var resultado = await _reclamacaoService.CriarReclamacaoAsync(dto, userId);
            return StatusCode(StatusCodes.Status201Created, resultado);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
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
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized(new { message = "Usuário não autenticado." });

            var reclamacoes = await _reclamacaoService.ListarMinhasReclamacoesAsync(userId);
            return Ok(reclamacoes);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }

    /// <summary>
    /// (Admin) Lista todas as reclamações do condomínio.
    /// </summary>
    [HttpGet("admin-reclamacoes")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodasReclamacoesAdmin()
    {
        try
        {
            var reclamacoes = await _reclamacaoService.ListarTodasReclamacoesAsync();
            return Ok(reclamacoes);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }

    /// <summary>
    /// Lista todas as reclamações do condomínio de forma anônima.
    /// </summary>
    [HttpGet("todas-reclamacoes")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoPublicaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodasReclamacoesPublicas()
    {
        try
        {
            var reclamacoes = await _reclamacaoService.ListarTodasReclamacoesPublicasAsync();
            return Ok(reclamacoes);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
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
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized(new { message = "Usuário não autenticado." });

            var resultado = await _reclamacaoService.AtualizarReclamacaoAsync(id, userId, dto);
            return Ok(resultado);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }

    /// <summary>
    /// (Admin) Atualiza qualquer reclamação do sistema.
    /// </summary>
    [HttpPut("admin-atualizar-reclamacao/{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarReclamacaoAdmin(long id, [FromBody] ReclamacaoAdminUpdateDto dto)
    {
        try
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminId))
                return Unauthorized(new { message = "Administrador não autenticado." });

            var resultado = await _reclamacaoService.AtualizarReclamacaoAdminAsync(id, adminId, dto);
            return Ok(resultado);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
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
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return Unauthorized(new { message = "Usuário não autenticado." });

            await _reclamacaoService.CancelarReclamacaoAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }

    /// <summary>
    /// (Admin) Deleta qualquer reclamação do sistema.
    /// </summary>
    [HttpDelete("admin-delete-reclamacao/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeletarReclamacaoAdmin(long id)
    {
        try
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminId))
                return Unauthorized(new { message = "Administrador não autenticado." });

            await _reclamacaoService.CancelarReclamacaoAdminAsync(id, adminId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }
}