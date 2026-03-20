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

    [HttpGet]
    [Authorize]
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

    [HttpPost]
    [Authorize(Roles = CategoriaAcessoConstants.FUNCIONARIO_ROLE)]
    [ProducesResponseType(typeof(EncomendaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CriarEncomenda([FromBody] EncomendaCreateDto dto)
    {
        try
        {
            var resultado = await _encomendaService.CriarEncomendaAsync(dto);
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
}
