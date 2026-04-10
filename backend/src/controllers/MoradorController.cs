// Controllers/MoradorController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Morador;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/moradores")]
[Tags("Gestão de Moradores")]
public class MoradorController : ControllerBase
{
    private readonly IMoradorService _moradorService;

    public MoradorController(IMoradorService moradorService)
    {
        _moradorService = moradorService;
    }

    // --------------------------- READ ---------------------------
    
    /// <summary>
    /// Lista todos os moradores ativos do condomínio.
    /// </summary>
    /// <returns>Uma lista contendo os dados dos moradores.</returns>
    [HttpGet]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<MoradorResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarMoradores()
    {
        var moradores = await _moradorService.ListarMoradoresAsync();
        return Ok(moradores);
    }

    /// <summary>
    /// Retorna os detalhes de um morador específico.
    /// </summary>
    /// <param name="id">ID numérico do morador.</param>
    /// <returns>Os dados detalhados do morador solicitado.</returns>
    [HttpGet("{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(MoradorResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterMorador(long id)
    {
        var morador = await _moradorService.ObterMoradorPorIdAsync(id);
        return Ok(morador);
    }

    // --------------------------- UPDATE ---------------------------
    
    /// <summary>
    /// (Admin) Atualiza os dados residenciais (Bloco e Apartamento) de um morador.
    /// </summary>
    /// <param name="id">ID do morador a ser atualizado.</param>
    /// <param name="dto">Novos dados de bloco e apartamento.</param>
    /// <returns>Retorna o morador com os dados atualizados.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(MoradorResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarMorador(long id, [FromBody] MoradorUpdateDto dto)
    {
        var resultado = await _moradorService.AtualizarMoradorAsync(id, dto);
        return Ok(resultado);
    }

    // --------------------------- DELETE ---------------------------
    
    /// <summary>
    /// (Admin) Inativa o registro de um morador no sistema.
    /// </summary>
    /// <param name="id">ID do morador a ser inativado.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarMorador(long id)
    {
        await _moradorService.DeletarMoradorAsync(id);
        return NoContent();
    }
}