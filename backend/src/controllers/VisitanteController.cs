using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Visitante;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/visitantes")]
[Tags("Gestão de Visitantes")]
public class VisitanteController : ControllerBase
{
    private readonly IVisitanteService _visitanteService;

    public VisitanteController(IVisitanteService visitanteService)
    {
        _visitanteService = visitanteService;
    }

    /// <summary>Lista todos os visitantes cadastrados.</summary>
    [HttpGet]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<VisitanteResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarVisitantes()
    {
        var visitantes = await _visitanteService.ListarVisitantesAsync();
        return Ok(visitantes);
    }

    /// <summary>Lista visitantes com status do último acesso.</summary>
    [HttpGet("com-acesso")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<VisitanteComAcessoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarVisitantesComAcesso()
    {
        var visitantes = await _visitanteService.ListarVisitantesComAcessoAsync();
        return Ok(visitantes);
    }

    /// <summary>Atualiza os dados de um visitante existente.</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(VisitanteResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarVisitante(long id, [FromBody] AtualizarVisitanteDto dto)
    {
        var visitante = await _visitanteService.AtualizarVisitanteAsync(id, dto);
        return Ok(visitante);
    }

    /// <summary>Registra um novo acesso para um visitante já cadastrado.</summary>
    [HttpPost("{id}/acessos")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AcessoVisitanteResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegistrarAcessoExistente(long id, [FromBody] RegistrarAcessoExistenteDto dto)
    {
        var acesso = await _visitanteService.RegistrarAcessoExistenteAsync(id, dto);
        return CreatedAtAction(nameof(ObterAcessoPorId), new { id = acesso.Id }, acesso);
    }

    /// <summary>Inativa um visitante (saiu do prédio).</summary>
    [HttpPatch("{id}/inativar")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> InativarVisitante(long id)
    {
        await _visitanteService.InativarVisitanteAsync(id);
        return NoContent();
    }

    /// <summary>Registra a entrada de um visitante.</summary>
    [HttpPost("entrada")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AcessoVisitanteResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegistrarEntrada([FromBody] RegistrarEntradaDto dto)
    {
        var acesso = await _visitanteService.RegistrarEntradaAsync(dto);
        return CreatedAtAction(nameof(ObterAcessoPorId), new { id = acesso.Id }, acesso);
    }

    /// <summary>Registra a saída de um visitante.</summary>
    [HttpPatch("saida/{idAcesso}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AcessoVisitanteResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegistrarSaida(long idAcesso)
    {
        var acesso = await _visitanteService.RegistrarSaidaAsync(idAcesso);
        return Ok(acesso);
    }

    /// <summary>Lista todos os acessos.</summary>
    [HttpGet("acessos")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<AcessoVisitanteResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarAcessos()
    {
        var acessos = await _visitanteService.ListarAcessosAsync();
        return Ok(acessos);
    }

    /// <summary>Lista acessos em aberto.</summary>
    [HttpGet("acessos/abertos")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<AcessoVisitanteResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarAcessosEmAberto()
    {
        var acessos = await _visitanteService.ListarAcessosEmAbertoAsync();
        return Ok(acessos);
    }

    /// <summary>Obtém detalhes de um acesso.</summary>
    [HttpGet("acessos/{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(AcessoVisitanteResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterAcessoPorId(long id)
    {
        var acesso = await _visitanteService.ObterAcessoPorIdAsync(id);
        return Ok(acesso);
    }
}
