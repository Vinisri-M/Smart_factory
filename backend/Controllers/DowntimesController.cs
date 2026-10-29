using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DowntimesController : ControllerBase
{
    private readonly AppDbContext _context;

    public DowntimesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Downtime>>> GetDowntimes()
    {
        return await _context.Downtimes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Downtime>> GetDowntime(int id)
    {
        var downtime = await _context.Downtimes.FindAsync(id);

        if (downtime == null)
        {
            return NotFound();
        }

        return downtime;
    }

    [HttpPost]
    public async Task<ActionResult<Downtime>> PostDowntime(Downtime downtime)
    {
        _context.Downtimes.Add(downtime);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetDowntime", new { id = downtime.Id }, downtime);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutDowntime(int id, Downtime downtime)
    {
        if (id != downtime.Id)
        {
            return BadRequest();
        }

        _context.Entry(downtime).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!DowntimeExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDowntime(int id)
    {
        var downtime = await _context.Downtimes.FindAsync(id);
        if (downtime == null)
        {
            return NotFound();
        }

        _context.Downtimes.Remove(downtime);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool DowntimeExists(int id)
    {
        return _context.Downtimes.Any(e => e.Id == id);
    }
}