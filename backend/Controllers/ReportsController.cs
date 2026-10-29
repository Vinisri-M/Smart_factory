using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Report>>> GetReports()
    {
        return await _context.Reports.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Report>> GetReport(int id)
    {
        var report = await _context.Reports.FindAsync(id);

        if (report == null)
        {
            return NotFound();
        }

        return report;
    }

    [HttpPost]
    public async Task<ActionResult<Report>> PostReport(Report report)
    {
        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetReport", new { id = report.Id }, report);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutReport(int id, Report report)
    {
        if (id != report.Id)
        {
            return BadRequest();
        }

        _context.Entry(report).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ReportExists(id))
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
    public async Task<IActionResult> DeleteReport(int id)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null)
        {
            return NotFound();
        }

        _context.Reports.Remove(report);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ReportExists(int id)
    {
        return _context.Reports.Any(e => e.Id == id);
    }
}