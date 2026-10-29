using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Downtime
{
    public int Id { get; set; }
    public string Machine { get; set; } = null!;
    public string Date { get; set; } = null!;
    public string From { get; set; } = null!;
    public string To { get; set; } = null!;
    public string Duration { get; set; } = null!;
    public string Reason { get; set; } = null!;
}