// Controllers/LocalController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Constants;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

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
    /// (Admin) Cria um novo local.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(LocalResponseDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CriarLocal([FromBody] LocalCreateDto dto)
    {
        var resultado = await _localService.CriarLocalAsync(dto);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    // --------------------------- READ ---------------------------
    
    /// <summary>
    /// Lista os locais cadastrados no sistema.
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<LocalResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarLocais()
    {
        var locais = await _localService.ListarLocaisAsync();
        return Ok(locais);
    }

    /// <summary>
    /// Lista o local cadastrado selecionado.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(LocalResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterLocal(long id)
    {
        var local = await _localService.ObterLocalPorIdAsync(id);
        return Ok(local);
    }

    // --------------------------- UPDATE ---------------------------

    /// <summary>
    /// (Admin) Atualiza dados ou status de um local.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(LocalResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarLocal(long id, [FromBody] LocalUpdateDto dto)
    {
        var resultado = await _localService.AtualizarLocalAsync(id, dto);
        return Ok(resultado);
    }

    // --------------------------- DELETE ---------------------------

    /// <summary>
    /// (Admin) Deleta ou inativa o registro de um local.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeletarLocal(long id)
    {
        await _localService.DeletarLocalAsync(id);
        return NoContent();
    }
}