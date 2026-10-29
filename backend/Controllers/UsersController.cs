using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _db.Users
            .OrderBy(u => u.Username)
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        if (await _db.Users.AnyAsync(u => u.Username == user.Username))
        {
            return BadRequest("Username already exists");
        }

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
    {
        if (id != user.Id)
        {
            return BadRequest("ID mismatch");
        }

        var existingUser = await _db.Users.FindAsync(id);
        if (existingUser == null)
        {
            return NotFound();
        }

        existingUser.Username = user.Username;
        existingUser.Password = user.Password;
        existingUser.Role = user.Role;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("reset")]
    public async Task<IActionResult> ResetUsers()
    {
        _db.Users.RemoveRange(_db.Users);
        _db.Users.AddRange(
            new User { Username = "ADM001", Password = "1234", Role = "Admin" },
            new User { Username = "SUP101", Password = "1234", Role = "Supervisor" },
            new User { Username = "OPR201", Password = "1234", Role = "Operator" },
            new User { Username = "MNT301", Password = "1234", Role = "Maintenance" },
            new User { Username = "OPR202", Password = "1234", Role = "Operator" }
        );

        await _db.SaveChangesAsync();

        return Ok("Users reset to default");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

        if (user == null)
        {
            return Unauthorized("Invalid username or password");
        }

        return Ok(new { username = user.Username, role = user.Role });
    }
}

public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}