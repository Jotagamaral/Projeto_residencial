using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Gestão de Moradores")]
public class MoradorController : ControllerBase
{
    private readonly AppDbContext _context;

    public MoradorController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarMoradores()
    {
        try
        {
            var moradores = await _context.Moradores
                .Where(m => m.Ativo)
                .Include(m => m.Usuario)
                .Select(m => new { m.Id, Nome = m.Usuario!.Nome })
                .ToListAsync();

            return Ok(moradores);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Erro interno: {ex.Message}");
        }
    }
}
