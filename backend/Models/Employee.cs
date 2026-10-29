namespace backend.Models;

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Department { get; set; } = null!;
    public int HoursWorked { get; set; }
    public int LeaveDays { get; set; }
    public int WorkedDays { get; set; }
}
