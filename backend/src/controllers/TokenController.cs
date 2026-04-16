using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.src.constants;

namespace backend.src.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("Áreas Restritas (Permissões)")]
    public class AreaRestritaController : ControllerBase
    {
        /// <summary>
        /// Retorna dados básicos do perfil do usuário logado.
        /// </summary>

        [Authorize]
        [HttpGet("perfil")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult GetPerfil()
        {
            return Ok("Você está autenticado.");
        }

        /// <summary>
        /// Acessa funcionalidades exclusivas para Moradores.
        /// </summary>

        // Somente usuários com a Role "Morador" podem acessar
        [Authorize(Roles = CategoriaAcessoConstants.MORADOR_ROLE)]
        [HttpGet("area-morador")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult GetAreaMorador()
        {
            return Ok("Bem-vindo, morador.");
        }

        /// <summary>
        /// Acessa funcionalidades exclusivas para Funcionários.
        /// </summary>

        // Somente usuários com a Role "Funcionario" podem acessar
        [Authorize(Roles = CategoriaAcessoConstants.FUNCIONARIO_ROLE)]
        [HttpGet("area-funcionario")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult GetAreaFuncionario()
        {
            return Ok("Bem-vindo, funcionário.");
        }
    }
}