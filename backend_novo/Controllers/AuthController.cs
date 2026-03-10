using Microsoft.AspNetCore.Mvc;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;
namespace backend_novo.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUsuarioService _usuarioService;

    public AuthController(IAuthService authService, IUsuarioService usuarioService)
    {
        _authService = authService;
        _usuarioService = usuarioService;
    }

    [HttpPost("register")]
    // Retornos esperados (SWAGGER)
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    [HttpPost("login")]
    // Retornos esperados (SWAGGER)
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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