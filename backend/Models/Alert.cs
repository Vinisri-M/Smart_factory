using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Alert
{
    public int Id { get; set; }
    public string Machine { get; set; } = null!;
    public string Severity { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Time { get; set; } = null!;
    public string Date { get; set; } = null!;
    public bool Acknowledged { get; set; }
    public string Status { get; set; } = null!;
    public string Role { get; set; } = null!;
    public int Response { get; set; }
}