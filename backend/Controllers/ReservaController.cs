using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Constants;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

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

    // --------------------------- CREATE ---------------------------

    /// <summary>
    /// Cria uma nova reserva de espaço comum para o morador autenticado.
    /// </summary>
    /// <remarks>
    /// O ID do Morador é extraído automaticamente do Token JWT.
    /// Não é necessário enviar quem está reservando no corpo da requisição.
    /// </remarks>
    /// <returns>Retorna os detalhes da reserva confirmada.</returns>
    [HttpPost("criar-reservas")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReservaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CriarReserva([FromBody] ReservaCreateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _reservaService.CriarReservaAsync(dto);
        
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    /// <summary>
    /// (Admin) Cria uma nova reserva de espaço comum para qualquer morador.
    /// </summary>
    [HttpPost("admin-criar-reservas")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(ReservaResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CriarReservaAdmin([FromBody] ReservaAdminCreateDto dto)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminIdLogado))
            return Unauthorized(new { message = "Não foi possível identificar o administrador logado." });

        var resultado = await _reservaService.CriarReservaAdminAsync(dto, adminIdLogado);
        
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    // --------------------------- READ ---------------------------
    
    /// <summary>
    /// Lista apenas as reservas do morador autenticado.
    /// </summary>
    [HttpGet("minhas-reservas")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReservaResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarMinhasReservas()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var reservas = await _reservaService.ListarMinhasReservasAsync(userId);
        return Ok(reservas);
    }

    /// <summary>
    /// (Admin) Lista todas as reservas do condomínio.
    /// </summary>
    [HttpGet("admin-reservas")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReservaResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodasReservasAdmin()
    {
        var reservas = await _reservaService.ListarReservasAsync();
        return Ok(reservas);
    }

    /// <summary>
    /// Retorna as datas e horários ocupados em todos os locais.
    /// </summary>
    [HttpGet("todas-reservas")]
    [Authorize] // Qualquer usuário logado pode ver o calendário
    [ProducesResponseType(typeof(IEnumerable<ReservaCalendarioDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarCalendarioOcupacao()
    {
        var ocupacoes = await _reservaService.ListarOcupacoesAsync();
        return Ok(ocupacoes);
    }

    // --------------------------- UPDATE ---------------------------

    /// <summary>
    /// Atualiza data, horário ou local de uma reserva do morador autenticado.
    /// </summary>
    [HttpPut("atualizar-reserva/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReservaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarReserva(long id, [FromBody] ReservaUpdateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _reservaService.AtualizarReservaAsync(id, userId, dto);
        
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin) Atualiza qualquer reserva do sistema.
    /// </summary>
    [HttpPut("admin-atualizar-reserva/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(ReservaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarReservaAdmin(long id, [FromBody] ReservaAdminUpdateDto dto)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminIdLogado))
            return Unauthorized(new { message = "Administrador não autenticado." });

        var resultado = await _reservaService.AtualizarReservaAdminAsync(id, adminIdLogado, dto);
        
        return Ok(resultado);
    }

    // --------------------------- DELETE ---------------------------

    /// <summary>
    /// Cancela uma reserva existente do morador autenticado.
    /// </summary>
    [HttpDelete("delete-reserva/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelarReserva(long id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        await _reservaService.CancelarReservaAsync(id, userId);
        
        return NoContent(); // 204 é o padrão REST para exclusão com sucesso
    }

    /// <summary>
    /// (Exclusivo Admin) Cancela qualquer reserva do sistema.
    /// </summary>
    [HttpDelete("admin-deletar-reserva/{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelarReservaAdmin(long id)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminId))
            return Unauthorized(new { message = "Administrador não autenticado." });

        await _reservaService.CancelarReservaAdminAsync(id, adminId);
        
        return NoContent();
    }
}