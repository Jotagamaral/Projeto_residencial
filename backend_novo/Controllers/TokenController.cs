using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_novo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AreaRestritaController : ControllerBase
    {
        // Qualquer usuário autenticado pode acessar
        [Authorize]
        [HttpGet("perfil")]
        public IActionResult GetPerfil()
        {
            return Ok("Você está autenticado.");
        }

        // Somente usuários com a Role "Morador" podem acessar
        [Authorize(Roles = "Morador")]
        [HttpGet("area-morador")]
        public IActionResult GetAreaMorador()
        {
            return Ok("Bem-vindo, morador.");
        }

        // Somente usuários com a Role "Funcionario" podem acessar
        [Authorize(Roles = "Funcionario")]
        [HttpGet("area-funcionario")]
        public IActionResult GetAreaFuncionario()
        {
            return Ok("Bem-vindo, funcionário.");
        }
    }
}