using Microsoft.AspNetCore.Mvc;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;

namespace backend_novo.Controllers;

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
    ///        "nome": "João",
    ///        "cpf": "12345678900",
    ///        "categoriaAcessoId": 2
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
        try
        {
            //Chama o serviço
            var result = await _usuarioService.CriarUsuarioAsync(dto);
            
            // HTTP (201) Sucesso: Created
            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (ArgumentException ex) 
        {
            // HTTP 400 (Bad Request) Dados incorretos e etc.
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception e)
        {
            // HTTP 500 (Internal Server Error) Erro interno
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno no servidor: {e.Message}");
        }
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
        try
        {
            // Serviço Chamado
            var resposta = await _authService.AutenticarAsync(dto);
            // Verificação de Token
            if (string.IsNullOrEmpty(resposta.Token))
            {
                // HTTP 401 (Acesso Não Autorizado)
                return Unauthorized(resposta);
            }

            // HTTP 200 (Sucesso)
            return Ok(resposta);
            
        }
        catch (Exception e)
        {
           // Retorna 500 para erros desconhecidos
            return StatusCode(500, $"Erro interno no servidor: {e.Message}");
            throw;
        }

    }
}