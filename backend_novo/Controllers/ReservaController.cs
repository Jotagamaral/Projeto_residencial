using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend_novo.Constants;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;

namespace backend_novo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Gestão de Reservas")] 
public class ReservaController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public ReservaController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    /// <summary>
    /// Cria uma nova reserva de espaço comum para o morador autenticado.
    /// </summary>
    /// <remarks>
    /// Lembre-se: O ID do Morador é extraído automaticamente do Token JWT.
    /// Não é necessário enviar quem está reservando no corpo da requisição.
    /// </remarks>
    /// <param name="dto">Dados do local e horário da reserva.</param>
    /// <returns>Retorna os detalhes da reserva confirmada.</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<ReservaResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarReservas()
    {
        try
        {
            var reservas = await _reservaService.ListarReservasAsync();
            return Ok(reservas);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }

    [HttpPost]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReservaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CriarReserva([FromBody] ReservaCreateDto dto)
    {
        try
        {
            var resultado = await _reservaService.CriarReservaAsync(dto);
            
            // Retorna 201 Created indicando que o recurso foi criado no banco
            return StatusCode(StatusCodes.Status201Created, resultado);
        }
        catch (ArgumentException ex)
        {
            // Erros de regra de negócio: Horário conflitante, data no passado, etc.
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Erros de segurança: Token inválido ou usuário tentando burlar o sistema
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Erro genérico de servidor (banco fora do ar, etc.)
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }
}