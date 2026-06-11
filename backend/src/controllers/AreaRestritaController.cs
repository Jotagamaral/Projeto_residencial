// Controllers/AreaRestritaController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;
using backend.src.dtos.Funcionario;
using backend.src.dtos.Morador;
using backend.src.dtos.Usuario;
using backend.src.services.interfaces;

namespace backend.src.controllers;

[ApiController]
[Route("api/arearestrita")]
[Tags("Áreas Restritas (Permissões)")]
public class AreaRestritaController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;
    private readonly IMoradorService _moradorService;
    private readonly IFuncionarioService _funcionarioService;

    public AreaRestritaController(
        IUsuarioService usuarioService,
        IMoradorService moradorService,
        IFuncionarioService funcionarioService)
    {
        _usuarioService = usuarioService;
        _moradorService = moradorService;
        _funcionarioService = funcionarioService;
    }

    // ---------- ADMIN ----------
    [HttpGet("area-admin")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAreaAdmin()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _usuarioService.ObterPerfilAdminPorUserIdAsync(userId);
        return Ok(resultado);
    }

    [HttpPut("area-admin/meus-dados")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(typeof(FuncionarioResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarMeusDadosAdmin([FromBody] FuncionarioUpdateDadosPessoaisDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _funcionarioService.AtualizarDadosPessoaisAsync(userId, dto);
        return Ok(resultado);
    }

    [HttpPut("area-admin/minha-senha")]
    [Authorize(Roles = CategoriaAcessoConstants.ADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AlterarMinhaSenhaAdmin([FromBody] FuncionarioAlterarSenhaDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        await _funcionarioService.AlterarSenhaAsync(userId, dto);
        return NoContent();
    }

    // ---------- MORADOR ----------
    [HttpGet("area-morador")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(MoradorResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAreaMorador()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _moradorService.ObterPerfilPorUserIdAsync(userId);
        return Ok(resultado);
    }

    [HttpPut("area-morador/meus-dados")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(typeof(MoradorResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarMeusDadosMorador([FromBody] MoradorUpdateDadosPessoaisDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _moradorService.AtualizarDadosPessoaisAsync(userId, dto);
        return Ok(resultado);
    }

    [HttpPut("area-morador/minha-senha")]
    [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AlterarMinhaSenhaMorador([FromBody] MoradorAlterarSenhaDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        await _moradorService.AlterarSenhaAsync(userId, dto);
        return NoContent();
    }

    // ---------- FUNCIONÁRIO ----------
    [HttpGet("area-funcionario")]
    [Authorize(Roles = CategoriaAcessoConstants.FUNCIONARIO_ROLE )]
    [ProducesResponseType(typeof(FuncionarioResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAreaFuncionario()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _funcionarioService.ObterPerfilPorUserIdAsync(userId);
        return Ok(resultado);
    }

    [HttpPut("area-funcionario/meus-dados")]
    [Authorize(Roles = CategoriaAcessoConstants.FUNCIONARIO_ROLE)]
    [ProducesResponseType(typeof(FuncionarioResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarMeusDadosFuncionario([FromBody] FuncionarioUpdateDadosPessoaisDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        var resultado = await _funcionarioService.AtualizarDadosPessoaisAsync(userId, dto);
        return Ok(resultado);
    }

    [HttpPut("area-funcionario/minha-senha")]
    [Authorize(Roles = CategoriaAcessoConstants.FUNCIONARIO_ROLE)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AlterarMinhaSenhaFuncionario([FromBody] FuncionarioAlterarSenhaDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
            return Unauthorized(new { message = "Usuário não autenticado." });

        await _funcionarioService.AlterarSenhaAsync(userId, dto);
        return NoContent();
    }
}