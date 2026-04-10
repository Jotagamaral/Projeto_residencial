// Controllers/ReservaController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Reserva;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/reservas")]
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
    /// <param name="dto">Dados da reserva (Local, Data de Início e Fim).</param>
    /// <returns>Retorna os detalhes da reserva confirmada.</returns>
    [HttpPost]
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
    /// <param name="dto">Dados da reserva, incluindo o ID do usuário que utilizará o espaço.</param>
    /// <returns>Retorna os detalhes da reserva gerada.</returns>
    [HttpPost("admin")]
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
    /// (Admin) Lista todas as reservas do condomínio.
    /// </summary>
    /// <returns>Lista completa de reservas do sistema.</returns>
    [HttpGet]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReservaResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarTodasReservasAdmin()
    {
        var reservas = await _reservaService.ListarReservasAsync();
        return Ok(reservas);
    }

    /// <summary>
    /// Lista apenas as reservas do morador autenticado.
    /// </summary>
    /// <returns>Lista de reservas do usuário logado.</returns>
    [HttpGet("minhas")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReservaResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarMinhasReservas()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var reservas = await _reservaService.ListarMinhasReservasAsync(userId);
        return Ok(reservas);
    }

    /// <summary>
    /// Retorna as datas e horários ocupados em todos os locais (para montagem de interface visual).
    /// </summary>
    /// <returns>Lista simplificada de ocupações (Local, Início, Fim).</returns>
    [HttpGet("calendario")]
    [Authorize] // Qualquer usuário logado pode ver o calendário
    [ProducesResponseType(typeof(IEnumerable<ReservaCalendarioDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ListarCalendarioOcupacao()
    {
        var ocupacoes = await _reservaService.ListarOcupacoesAsync();
        return Ok(ocupacoes);
    }

    // --------------------------- UPDATE ---------------------------

    /// <summary>
    /// Atualiza data, horário ou local de uma reserva pertencente ao morador autenticado.
    /// </summary>
    /// <param name="id">ID numérico da reserva.</param>
    /// <param name="dto">Novos dados de data e local.</param>
    /// <returns>Reserva atualizada.</returns>
    [HttpPut("{id}")]
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
    /// <param name="id">ID numérico da reserva.</param>
    /// <param name="dto">Novos dados (Data, Local, Status).</param>
    /// <returns>Reserva atualizada gerencialmente.</returns>
    [HttpPut("{id}/admin")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(ReservaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
    /// Cancela uma reserva existente pertencente ao morador autenticado.
    /// </summary>
    /// <param name="id">ID da reserva a ser cancelada.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}")]
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
        
        return NoContent(); 
    }

    /// <summary>
    /// (Admin) Cancela ou inativa qualquer reserva do sistema.
    /// </summary>
    /// <param name="id">ID da reserva a ser forçosamente cancelada.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}/admin")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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