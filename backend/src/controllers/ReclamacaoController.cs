// Controllers/ReclamacaoController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Reclamacao;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/reclamacoes")]
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
    /// <param name="dto">Dados da reclamação (Título e Descrição).</param>
    /// <returns>Retorna os detalhes da reclamação registrada.</returns>
    [HttpPost]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
    /// (Admin/Funcionário) Lista todas as reclamações do condomínio com detalhes e identificação.
    /// </summary>
    /// <returns>Lista completa de reclamações.</returns>
    [HttpGet]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarTodasReclamacoesAdmin()
    {
        var reclamacoes = await _reclamacaoService.ListarTodasReclamacoesAsync();
        return Ok(reclamacoes);
    }

    /// <summary>
    /// Lista apenas as reclamações pertencentes ao morador autenticado.
    /// </summary>
    /// <returns>Lista das reclamações do usuário.</returns>
    [HttpGet("minhas")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarMinhasReclamacoes()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var reclamacoes = await _reclamacaoService.ListarMinhasReclamacoesAsync(userId);
        return Ok(reclamacoes);
    }

    /// <summary>
    /// Lista todas as reclamações do condomínio de forma anônima (Mural Público).
    /// </summary>
    /// <returns>Lista de reclamações sem os dados do autor.</returns>
    [HttpGet("publicas")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.MORADOR_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<ReclamacaoPublicaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ListarTodasReclamacoesPublicas()
    {
        var reclamacoes = await _reclamacaoService.ListarTodasReclamacoesPublicasAsync();
        return Ok(reclamacoes);
    }

    // ---------------- UPDATE ----------------

    /// <summary>
    /// Atualiza o texto de uma reclamação do morador autenticado.
    /// </summary>
    /// <param name="id">ID numérico da reclamação.</param>
    /// <param name="dto">Novos dados da reclamação.</param>
    /// <returns>A reclamação atualizada.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarReclamacao(long id, [FromBody] ReclamacaoUpdateDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _reclamacaoService.AtualizarReclamacaoAsync(id, userId, dto);
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin) Atualiza o status de qualquer reclamação do sistema.
    /// </summary>
    /// <param name="id">ID numérico da reclamação.</param>
    /// <param name="dto">Dados para atualização gerencial (Status).</param>
    /// <returns>A reclamação com o status atualizado.</returns>
    [HttpPut("{id}/admin")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.FUNCIONARIO_ROLE},{CategoriaAcessoConstants.ADMIN_ROLE}")]
    [ProducesResponseType(typeof(ReclamacaoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
    /// Deleta ou cancela uma reclamação existente do morador autenticado.
    /// </summary>
    /// <param name="id">ID da reclamação a ser removida.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarReclamacao(long id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        await _reclamacaoService.CancelarReclamacaoAsync(id, userId);
        return NoContent();
    }

    /// <summary>
    /// (Admin) Força a deleção ou inativação de qualquer reclamação do sistema.
    /// </summary>
    /// <param name="id">ID da reclamação a ser inativada.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}/admin")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarReclamacaoAdmin(long id)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminIdClaim) || !long.TryParse(adminIdClaim, out long adminId))
            return Unauthorized(new { message = "Administrador não autenticado." });

        await _reclamacaoService.CancelarReclamacaoAdminAsync(id, adminId);
        return NoContent();
    }
}