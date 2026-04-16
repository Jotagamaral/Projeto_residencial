// Controllers/FuncionarioController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Funcionario;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/funcionarios")]
[Tags("Gestão de Funcionários")]
public class FuncionarioController : ControllerBase
{
    private readonly IFuncionarioService _funcionarioService;

    public FuncionarioController(IFuncionarioService funcionarioService)
    {
        _funcionarioService = funcionarioService;
    }

    // --------------------------- READ ---------------------------
    
    /// <summary>
    /// Lista todos os funcionários ativos do condomínio.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(IEnumerable<FuncionarioResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarFuncionarios()
    {
        var funcionarios = await _funcionarioService.ListarFuncionariosAsync();
        return Ok(funcionarios);
    }

    /// <summary>
    /// Retorna os detalhes de um funcionário específico.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = $"{CategoriaAcessoConstants.ADMIN_ROLE},{CategoriaAcessoConstants.FUNCIONARIO_ROLE}")]
    [ProducesResponseType(typeof(FuncionarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterFuncionario(long id)
    {
        var funcionario = await _funcionarioService.ObterFuncionarioPorIdAsync(id);
        return Ok(funcionario);
    }

    // --------------------------- UPDATE ---------------------------
    
    /// <summary>
    /// (Admin) Atualiza o cargo de um funcionário.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(FuncionarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarFuncionario(long id, [FromBody] FuncionarioUpdateDto dto)
    {
        var resultado = await _funcionarioService.AtualizarFuncionarioAsync(id, dto);
        return Ok(resultado);
    }

    // --------------------------- DELETE ---------------------------
    
    /// <summary>
    /// (Admin) Inativa o registro de um funcionário.
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarFuncionario(long id)
    {
        await _funcionarioService.DeletarFuncionarioAsync(id);
        return NoContent();
    }
}