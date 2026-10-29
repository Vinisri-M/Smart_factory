using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AlertsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Alert>>> GetAlerts()
    {
        return await _context.Alerts.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Alert>> GetAlert(int id)
    {
        var alert = await _context.Alerts.FindAsync(id);

        if (alert == null)
        {
            return NotFound();
        }

        return alert;
    }

    [HttpPost]
    public async Task<ActionResult<Alert>> PostAlert(Alert alert)
    {
        _context.Alerts.Add(alert);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetAlert", new { id = alert.Id }, alert);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAlert(int id, Alert alert)
    {
        if (id != alert.Id)
        {
            return BadRequest();
        }

        _context.Entry(alert).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AlertExists(id))
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
    public async Task<IActionResult> DeleteAlert(int id)
    {
        var alert = await _context.Alerts.FindAsync(id);
        if (alert == null)
        {
            return NotFound();
        }

        _context.Alerts.Remove(alert);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AlertExists(int id)
    {
        return _context.Alerts.Any(e => e.Id == id);
    }
}