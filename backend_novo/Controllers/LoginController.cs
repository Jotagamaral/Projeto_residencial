using backend_novo.DTOs;
using backend_novo.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend_novo.Controllers;

[ApiController]
[Route("api")]
public class LoginController : ControllerBase
{
    private readonly ILoginService _loginService;

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
    {
        try
        {
            var result = await _loginService.AuthenticateAsync(loginDto);

            if (result.User is null)
            {
                return StatusCode(500, new { message = result.Message });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"[ERRO]:{ex.Message}" });
        }
    }
}
