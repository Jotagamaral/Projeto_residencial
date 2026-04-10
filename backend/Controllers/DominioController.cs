// Controllers/DominioController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/dominios")] 
[Tags("Listas de Domínio (Status/Categorias)")]
public class DominioController : ControllerBase
{
    private readonly IDominioService _dominioService;

    public DominioController(IDominioService dominioService)
    {
        _dominioService = dominioService;
    }

    /// <summary>
    /// Lista os status disponíveis para as Encomendas.
    /// </summary>
    [HttpGet("status/encomendas")]
    [Authorize] // Qualquer logado pode ver para montar filtros no front
    [ProducesResponseType(typeof(IEnumerable<CategoriaStatusDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarStatusEncomendas()
    {
        var resultados = await _dominioService.ListarStatusEncomendaAsync();
        return Ok(resultados);
    }

    /// <summary>
    /// Lista os status disponíveis para as Reclamações.
    /// </summary>
    [HttpGet("status/reclamacoes")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<CategoriaStatusDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarStatusReclamacoes()
    {
        var resultados = await _dominioService.ListarStatusReclamacaoAsync();
        return Ok(resultados);
    }

    /// <summary>
    /// Lista os status disponíveis para as Reservas.
    /// </summary>
    [HttpGet("status/reservas")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<CategoriaStatusDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarStatusReservas()
    {
        var resultados = await _dominioService.ListarStatusReservaAsync();
        return Ok(resultados);
    }
}