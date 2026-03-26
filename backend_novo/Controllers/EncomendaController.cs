using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend_novo.Constants;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;

namespace backend_novo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Gestão de Encomendas")]
public class EncomendaController : ControllerBase
{
    private readonly IEncomendaService _encomendaService;

    public EncomendaController(IEncomendaService encomendaService)
    {
        _encomendaService = encomendaService;
    }

    // --------------------------- READ ---------------------------

    /// <summary>
    /// Lista todas as encomendas.
    /// </summary>
    [HttpGet]
    [Authorize] // Qualquer usuário logado pode visualizar
    [ProducesResponseType(typeof(IEnumerable<EncomendaResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarEncomendas()
    {
        try
        {
            var encomendas = await _encomendaService.ListarEncomendasAsync();
            return Ok(encomendas);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }

    // --------------------------- CREATE ---------------------------

    /// <summary>
    /// (Funcionário/Admin) Registra a chegada de uma nova encomenda.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(EncomendaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CriarEncomenda([FromBody] EncomendaCreateDto dto)
    {
        try
        {
            var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
                return Unauthorized(new { message = "Operador não autenticado." });

            var resultado = await _encomendaService.CriarEncomendaAsync(dto, operadorId);
            
            return StatusCode(StatusCodes.Status201Created, resultado);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
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

    // --------------------------- UPDATE ---------------------------

    /// <summary>
    /// (Funcionário/Admin) Atualiza dados ou status de uma encomenda.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(EncomendaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarEncomenda(long id, [FromBody] EncomendaUpdateDto dto)
    {
        try
        {
            var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
                return Unauthorized(new { message = "Operador não autenticado." });

            var resultado = await _encomendaService.AtualizarEncomendaAsync(id, dto, operadorId);
            
            return Ok(resultado);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
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

    // --------------------------- DELETE ---------------------------

    /// <summary>
    /// (Funcionário/Admin) Deleta ou inativa um registro de encomenda em caso de erro.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarEncomenda(long id)
    {
        try
        {
            var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
                return Unauthorized(new { message = "Operador não autenticado." });

            await _encomendaService.CancelarEncomendaAsync(id, operadorId);
            
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
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