using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services.Interfaces;

namespace backend.Controllers;

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
    // Retornos esperados (SWAGGER)
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] UsuarioCreateDto dto)
    {
            //Chama o serviço
            var result = await _usuarioService.CriarUsuarioAsync(dto);
            
            // HTTP (201) Sucesso: Created
            return StatusCode(StatusCodes.Status201Created, result);
      
    }

    /// <summary>
    /// Autentica um usuário e retorna o Token JWT.
    /// </summary>
    /// <param name="dto">Credenciais de acesso (E-mail e Senha).</param>
    /// <returns>Token de acesso e dados básicos do usuário.</returns>
    [HttpPost("login")]
    // Retornos esperados (SWAGGER)
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
   
        var resposta = await _authService.AutenticarAsync(dto);

        // HTTP 200 (Sucesso)
        return Ok(resposta);

    }
}