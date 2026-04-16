// EncomendaController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Encomenda;
using backend.src.services.interfaces;
using backend.src.exceptions; 

namespace backend.src.controllers;

[ApiController]
[Route("api/encomendas")]
[Tags("Gestão de Encomendas")]
public class EncomendaController : ControllerBase
{
    private readonly IEncomendaService _encomendaService;

    public EncomendaController(IEncomendaService encomendaService)
    {
        _encomendaService = encomendaService;
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
        var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
            return Unauthorized(new { message = "Operador não autenticado." });

        var resultado = await _encomendaService.CriarEncomendaAsync(dto, operadorId);
        
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    // --------------------------- READ ---------------------------

    /// <summary>
    /// Lista apenas as encomendas destinadas ao morador autenticado.
    /// </summary>
    [HttpGet("minhas")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<EncomendaResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ListarMinhasEncomendas()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _encomendaService.ListarMinhasEncomendasAsync(userId);
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin/Funcionário) Lista todas as encomendas.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")] 
    [ProducesResponseType(typeof(IEnumerable<EncomendaResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ListarEncomendas()
    {
        var encomendas = await _encomendaService.ListarEncomendasAsync();
        return Ok(encomendas);
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
        var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
            return Unauthorized(new { message = "Operador não autenticado." });

        var resultado = await _encomendaService.AtualizarEncomendaAsync(id, dto, operadorId);
        
        return Ok(resultado);
    }

    /// <summary>
    /// (Funcionário/Admin) Atualiza o status de retirada de uma encomenda.
    /// </summary>
    [HttpPatch("{id}/retirada")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(EncomendaResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarRetirada(long id, [FromBody] EncomendaRetiradaDto dto)
    {
        if (!dto.Retirada.HasValue)
            throw new BusinessRuleException("O campo retirada é obrigatório.");

        var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
            return Unauthorized(new { message = "Operador não autenticado." });

        var resultado = await _encomendaService.AtualizarRetiradaAsync(id, dto.Retirada.Value, operadorId);
        return Ok(resultado);
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
        var operadorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(operadorIdClaim) || !long.TryParse(operadorIdClaim, out long operadorId))
            return Unauthorized(new { message = "Operador não autenticado." });

        await _encomendaService.CancelarEncomendaAsync(id, operadorId);
        
        return NoContent();
    }
}