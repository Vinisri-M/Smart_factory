using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;

    public EmployeesController(AppDbContext db)
    {
        _db = db;
    }
    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _db.Employees
            .OrderBy(e => e.Name)
            .ToListAsync();

        return Ok(employees);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
    {
        if (id != employee.Id)
        {
            return BadRequest("ID mismatch");
        }

        var existingEmployee = await _db.Employees.FindAsync(id);
        if (existingEmployee == null)
        {
            return NotFound();
        }

        existingEmployee.Name = employee.Name;
        existingEmployee.Role = employee.Role;
        existingEmployee.HoursWorked = employee.HoursWorked;
        existingEmployee.LeaveDays = employee.LeaveDays;
        existingEmployee.WorkedDays = employee.WorkedDays;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("reset")]
    public async Task<IActionResult> ResetEmployees()
    {
        var employees = await _db.Employees.ToListAsync();
        foreach (var emp in employees)
        {
            emp.HoursWorked = 0;
            emp.LeaveDays = 0;
            emp.WorkedDays = 0;
        }

        await _db.SaveChangesAsync();

        return Ok("Employee work data reset");
    }
}
