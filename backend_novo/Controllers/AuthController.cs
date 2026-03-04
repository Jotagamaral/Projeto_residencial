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
    public async Task<IActionResult> Register([FromBody] UsuarioCreateDto dto)
    {
        var result = await _usuarioService.CriarUsuarioAsync(dto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginDto dto)
    {
        var token = await _authService.AutenticarAsync(dto);
        return Ok(new { token });
    }
}