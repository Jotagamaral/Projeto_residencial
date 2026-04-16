using Microsoft.AspNetCore.Mvc;
using backend.src.services.interfaces;
using backend.src.dtos.Login;
using backend.src.dtos.Usuario;

namespace backend.src.controllers;

[ApiController]
[Route("api/auth")]
[Tags("Autenticação e Registro")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUsuarioService _usuarioService;

    public AuthController(IAuthService authService, IUsuarioService usuarioService)
    {
        _authService = authService;
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Realiza o cadastro de um novo usuário (Morador ou Funcionário).
    /// </summary>
    /// <remarks>
    /// Exemplo de requisição:
    /// 
    ///     POST /api/auth/register
    ///     {
    ///         "nome": "João",
    ///         "cpf": "12345678901",
    ///         "email": "joao@condosync.com",
    ///         "rg": null,
    ///         "celular": "61932234334",
    ///         "apartamento": 101,
    ///         "bloco": "A",
    ///         "cargoId": null,
    ///         "senha": "Senha@123",
    ///         "categoriaAcessoId": 2
    ///     }
    /// </remarks>
    /// <param name="dto">Objeto contendo os dados necessários para o cadastro.</param>
    /// <returns>Dados do usuário recém-criado.</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] UsuarioCreateDto dto)
    {
        var result = await _usuarioService.CriarUsuarioAsync(dto);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>
    /// Autentica um usuário no sistema e retorna o Token JWT.
    /// </summary>
    /// <param name="dto">Credenciais de acesso (CPF e Senha).</param>
    /// <returns>Token de acesso e dados básicos do usuário logado.</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var resposta = await _authService.AutenticarAsync(dto);
        return Ok(resposta);
    }
}