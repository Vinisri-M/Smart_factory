using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MachinesController : ControllerBase
{
    private readonly AppDbContext _db;

    public MachinesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetMachines()
    {
        var machines = await _db.Machines
            .OrderBy(m => m.Name)
            .ToListAsync();

        return Ok(machines);
    }
}