using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Constants;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Avisos")]
public class AvisoController : ControllerBase
{
    private readonly IAvisoService _avisoService;

    public AvisoController(IAvisoService avisoService)
    {
        _avisoService = avisoService;
    }

    [HttpPost("criar-aviso")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AvisoResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Criar([FromBody] AvisoCreateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _avisoService.CriarAsync(dto, userId);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    [HttpGet("ativos")]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<AvisoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarAtivos()
    {
        var lista = await _avisoService.ListarAtivosAsync();
        return Ok(lista);
    }

    [HttpGet("todos")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IReadOnlyList<AvisoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodos()
    {
        var lista = await _avisoService.ListarTodosGestaoAsync();
        return Ok(lista);
    }

    [HttpPut("{id:long}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AvisoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(long id, [FromBody] AvisoUpdateDto dto)
    {
        var resultado = await _avisoService.AtualizarAsync(id, dto);
        return Ok(resultado);
    }

    [HttpPatch("{id:long}/ativo")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AvisoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DefinirAtivo(long id, [FromBody] AvisoAtivoDto dto)
    {
        var resultado = await _avisoService.DefinirAtivoAsync(id, dto.Ativo);
        return Ok(resultado);
    }
}
