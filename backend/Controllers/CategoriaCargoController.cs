// CategoriaCargoController.cs
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Categorias de Cargo")]
public class CategoriaCargoController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriaCargoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarCargos()
    {
        var cargos = await _context.CategoriaCargo
            .Select(c => new { c.Id, c.Nome })
            .ToListAsync();

        return Ok(cargos);
    }
}