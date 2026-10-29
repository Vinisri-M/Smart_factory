using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<Machine> Machines { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Alert> Alerts { get; set; } = null!;
    public DbSet<Downtime> Downtimes { get; set; } = null!;
    public DbSet<Report> Reports { get; set; } = null!;
    public DbSet<Fault> Faults { get; set; } = null!;
    public DbSet<PerformanceRecord> PerformanceRecords { get; set; } = null!;
}
