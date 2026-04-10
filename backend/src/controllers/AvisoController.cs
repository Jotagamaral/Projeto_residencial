using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Aviso;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/avisos")] 
[Tags("Gestão de Avisos")]
public class AvisoController : ControllerBase
{
    private readonly IAvisoService _avisoService;

    public AvisoController(IAvisoService avisoService)
    {
        _avisoService = avisoService;
    }

    // --------------------------- CREATE ---------------------------

    /// <summary>
    /// (Admin/Funcionário) Cria um novo aviso no mural do condomínio.
    /// </summary>
    /// <param name="dto">Dados do aviso (título, descrição, etc).</param>
    /// <returns>Retorna os detalhes do aviso criado.</returns>
    [HttpPost]
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

    // --------------------------- READ ---------------------------

    /// <summary>
    /// (Admin/Funcionário) Lista todo o histórico de avisos (ativos e inativos).
    /// </summary>
    /// <returns>Lista completa de avisos do sistema.</returns>
    [HttpGet]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IReadOnlyList<AvisoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarTodos()
    {
        var lista = await _avisoService.ListarTodosGestaoAsync();
        return Ok(lista);
    }

    /// <summary>
    /// Lista apenas os avisos que estão ativos no momento (Mural do Morador).
    /// </summary>
    /// <returns>Lista de avisos visíveis.</returns>
    [HttpGet("ativos")]
    [Authorize] // Qualquer usuário logado pode ler os avisos ativos
    [ProducesResponseType(typeof(IReadOnlyList<AvisoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarAtivos()
    {
        var lista = await _avisoService.ListarAtivosAsync();
        return Ok(lista);
    }

    // --------------------------- UPDATE ---------------------------

    /// <summary>
    /// (Admin/Funcionário) Atualiza as informações de um aviso (título, texto).
    /// </summary>
    /// <param name="id">ID numérico do aviso.</param>
    /// <param name="dto">Novos dados do aviso.</param>
    /// <returns>Retorna o aviso atualizado.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AvisoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(long id, [FromBody] AvisoUpdateDto dto)
    {
        var resultado = await _avisoService.AtualizarAsync(id, dto);
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin/Funcionário) Altera a visibilidade de um aviso (Ativa/Inativa).
    /// </summary>
    /// <remarks>
    /// Utilize este endpoint para "arquivar" um aviso sem deletá-lo do banco de dados.
    /// </remarks>
    /// <param name="id">ID numérico do aviso.</param>
    /// <param name="dto">Objeto contendo o novo status booleano (true/false).</param>
    /// <returns>Retorna o aviso com o status atualizado.</returns>
    [HttpPatch("{id}/ativo")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AvisoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DefinirAtivo(long id, [FromBody] AvisoAtivoDto dto)
    {
        var resultado = await _avisoService.DefinirAtivoAsync(id, dto.Ativo);
        return Ok(resultado);
    }
}