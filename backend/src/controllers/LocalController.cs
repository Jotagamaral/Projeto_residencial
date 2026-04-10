// Controllers/LocalController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Local;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/locais")]
[Tags("Gestão de Locais")]
public class LocalController : ControllerBase
{
    private readonly ILocalService _localService;

    public LocalController(ILocalService localService)
    {
        _localService = localService;
    }

    // --------------------------- CREATE ---------------------------

    /// <summary>
    /// (Admin) Cria um novo local (espaço comum) no condomínio.
    /// </summary>
    /// <param name="dto">Dados do novo local (Nome, Capacidade, etc).</param>
    /// <returns>Retorna os detalhes do local criado.</returns>
    [HttpPost]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(LocalResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CriarLocal([FromBody] LocalCreateDto dto)
    {
        var resultado = await _localService.CriarLocalAsync(dto);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    // --------------------------- READ ---------------------------
    
    /// <summary>
    /// Lista todos os locais ativos cadastrados no sistema.
    /// </summary>
    /// <returns>Uma lista de locais disponíveis.</returns>
    [HttpGet]
    [Authorize] // Qualquer usuário logado pode visualizar as áreas comuns
    [ProducesResponseType(typeof(IEnumerable<LocalResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarLocais()
    {
        var locais = await _localService.ListarLocaisAsync();
        return Ok(locais);
    }

    /// <summary>
    /// Busca os detalhes de um local específico pelo seu ID.
    /// </summary>
    /// <param name="id">ID numérico do local.</param>
    /// <returns>Os dados do local solicitado.</returns>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(LocalResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterLocal(long id)
    {
        var local = await _localService.ObterLocalPorIdAsync(id);
        return Ok(local);
    }

    // --------------------------- UPDATE ---------------------------

    /// <summary>
    /// (Admin) Atualiza o nome ou capacidade de um local.
    /// </summary>
    /// <param name="id">ID do local a ser atualizado.</param>
    /// <param name="dto">Novos dados do local.</param>
    /// <returns>O local com os dados atualizados.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(LocalResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarLocal(long id, [FromBody] LocalUpdateDto dto)
    {
        var resultado = await _localService.AtualizarLocalAsync(id, dto);
        return Ok(resultado);
    }

    // --------------------------- DELETE ---------------------------

    /// <summary>
    /// (Admin) Inativa o registro de um local (Soft Delete).
    /// </summary>
    /// <remarks>Não é possível excluir locais que possuam reservas futuras ativas.</remarks>
    /// <param name="id">ID do local a ser excluído.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarLocal(long id)
    {
        await _localService.DeletarLocalAsync(id);
        return NoContent();
    }
}