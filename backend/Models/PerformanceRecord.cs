namespace backend.Models;

public class PerformanceRecord
{
    public int Id { get; set; }
    public string Machine { get; set; } = null!;
    public string Date { get; set; } = null!;
    public decimal Temperature { get; set; }
    public int Load { get; set; }
}
