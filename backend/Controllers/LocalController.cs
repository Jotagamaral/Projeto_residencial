using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Gestão de Locais")]
public class LocalController : ControllerBase
{
    private readonly AppDbContext _context;

    public LocalController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarLocais()
    {
        var locais = await _context.Locais
            .Where(l => l.Ativo)
            .Select(l => new { l.Id, l.Nome, l.Capacidade })
            .ToListAsync();

        return Ok(locais);
    }
}
