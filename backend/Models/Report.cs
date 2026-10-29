using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Report
{
    public int Id { get; set; }
    public string Type { get; set; } = null!;
    public string Machine { get; set; } = null!;
    public string Date { get; set; } = null!;
    public string Data { get; set; } = null!;
    public decimal Value { get; set; }
}