using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FaultsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FaultsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fault>>> GetFaults()
    {
        return await _context.Faults.ToListAsync();
    }
}
