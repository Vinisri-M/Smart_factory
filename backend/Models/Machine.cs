using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Machine
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    [Column(TypeName = "decimal(18,2)")]
    public decimal Temperature { get; set; }
    public int Rpm { get; set; }
    public int Load { get; set; }
    public string Status { get; set; } = null!;
}