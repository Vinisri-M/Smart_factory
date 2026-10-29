namespace backend.Models;

public class Fault
{
    public int Id { get; set; }
    public string Machine { get; set; } = null!;
    public string Severity { get; set; } = null!;
    public string Date { get; set; } = null!;
    public string Description { get; set; } = null!;
}
