// Controllers/CategoriaCargoController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.CategoriaCargo;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/categorias-cargo")]
[Tags("Categorias de Cargo")]
public class CategoriaCargoController : ControllerBase
{
    private readonly ICategoriaCargoService _categoriaCargoService;

    public CategoriaCargoController(ICategoriaCargoService categoriaCargoService)
    {
        _categoriaCargoService = categoriaCargoService;
    }

    /// <summary>
    /// (Admin) Cria uma nova categoria de cargo.
    /// </summary>
    /// <param name="dto">Dados da nova categoria (ex: Nome).</param>
    /// <returns>Retorna os detalhes da categoria criada.</returns>
    [HttpPost]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(CategoriaCargoResponseDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CriarCargo([FromBody] CategoriaCargoCreateDto dto)
    {
        var resultado = await _categoriaCargoService.CriarCargoAsync(dto);
        return StatusCode(StatusCodes.Status201Created, resultado);
    }

    /// <summary>
    /// Lista todas as categorias de cargo ativas no sistema.
    /// </summary>
    /// <returns>Uma lista contendo as categorias de cargo.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoriaCargoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarCargos()
    {
        var resultados = await _categoriaCargoService.ListarCargosAsync();
        return Ok(resultados);
    }

    /// <summary>
    /// Busca os detalhes de uma categoria de cargo específica pelo seu ID.
    /// </summary>
    /// <param name="id">ID numérico da categoria de cargo.</param>
    /// <returns>Os dados da categoria solicitada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoriaCargoResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterCargoPorId(long id)
    {
        var resultado = await _categoriaCargoService.ObterCargoPorIdAsync(id);
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin) Atualiza os dados de uma categoria de cargo existente.
    /// </summary>
    /// <param name="id">ID da categoria que será atualizada.</param>
    /// <param name="dto">Novos dados para a categoria.</param>
    /// <returns>A categoria atualizada.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(CategoriaCargoResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarCargo(long id, [FromBody] CategoriaCargoUpdateDto dto)
    {
        var resultado = await _categoriaCargoService.AtualizarCargoAsync(id, dto);
        return Ok(resultado);
    }

    /// <summary>
    /// (Admin) Inativa ou exclui uma categoria de cargo pelo seu ID.
    /// </summary>
    /// <param name="id">ID da categoria a ser excluída.</param>
    /// <returns>Sem conteúdo (204) em caso de sucesso.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeletarCargo(long id)
    {
        await _categoriaCargoService.DeletarCargoAsync(id);
        return NoContent();
    }
}