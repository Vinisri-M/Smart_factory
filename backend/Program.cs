using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    try
    {
        // Validate the current schema by querying a field that was added to the Employee model.
        // This detects an out-of-sync SQLite schema if the HoursWorked column is missing.
        db.Employees.Select(e => e.HoursWorked).FirstOrDefault();
    }
    catch
    {
        // Recreate the database if the schema is out of sync with the current model.
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
    }

    if (!db.Employees.Any())
    {
        db.Employees.AddRange(
            new Employee { Name = "Viji", Role = "Admin", Department = "Administration" },
            new Employee { Name = "Srinidhi", Role = "Supervisor", Department = "Supervision" },
            new Employee { Name = "Archana", Role = "Operator", Department = "Operations" },
            new Employee { Name = "Srikanth", Role = "Maintenance", Department = "Maintenance" },
            new Employee { Name = "Vinisri", Role = "Operator", Department = "Operations" }
        );

        db.SaveChanges();
    }

    if (!db.Machines.Any())
    {
        db.Machines.AddRange(
            new Machine { Name = "Machine 1", Temperature = 297, Rpm = 1500, Load = 70, Status = "Normal" },
            new Machine { Name = "Machine 2", Temperature = 305, Rpm = 1400, Load = 65, Status = "Normal" },
            new Machine { Name = "Machine 3", Temperature = 320, Rpm = 1800, Load = 90, Status = "Alert" },
            new Machine { Name = "Machine 4", Temperature = 0, Rpm = 0, Load = 0, Status = "Offline" },
            new Machine { Name = "Machine 5", Temperature = 300, Rpm = 1600, Load = 75, Status = "Normal" },
            new Machine { Name = "Machine 6", Temperature = 310, Rpm = 1700, Load = 85, Status = "Alert" },
            new Machine { Name = "Machine 7", Temperature = 295, Rpm = 1450, Load = 60, Status = "Normal" },
            new Machine { Name = "Machine 8", Temperature = 330, Rpm = 1900, Load = 95, Status = "Alert" },
            new Machine { Name = "Machine 9", Temperature = 0, Rpm = 0, Load = 0, Status = "Offline" },
            new Machine { Name = "Machine 10", Temperature = 299, Rpm = 1550, Load = 72, Status = "Normal" },
            new Machine { Name = "Machine 11", Temperature = 302, Rpm = 1580, Load = 74, Status = "Normal" },
            new Machine { Name = "Machine 12", Temperature = 315, Rpm = 1750, Load = 88, Status = "Alert" },
            new Machine { Name = "Machine 13", Temperature = 0, Rpm = 0, Load = 0, Status = "Offline" },
            new Machine { Name = "Machine 14", Temperature = 298, Rpm = 1500, Load = 70, Status = "Normal" },
            new Machine { Name = "Machine 15", Temperature = 307, Rpm = 1680, Load = 82, Status = "Alert" },
            new Machine { Name = "Machine 16", Temperature = 293, Rpm = 1400, Load = 65, Status = "Normal" },
            new Machine { Name = "Machine 17", Temperature = 0, Rpm = 0, Load = 0, Status = "Offline" },
            new Machine { Name = "Machine 18", Temperature = 300, Rpm = 1600, Load = 75, Status = "Normal" },
            new Machine { Name = "Machine 19", Temperature = 318, Rpm = 1820, Load = 91, Status = "Alert" },
            new Machine { Name = "Machine 20", Temperature = 296, Rpm = 1480, Load = 68, Status = "Normal" }
        );

        db.SaveChanges();
    }

    if (!db.Users.Any())
    {
        db.Users.AddRange(
            new User { Username = "ADM001", Password = "1234", Role = "Admin" },
            new User { Username = "SUP101", Password = "1234", Role = "Supervisor" },
            new User { Username = "OPR201", Password = "1234", Role = "Operator" },
            new User { Username = "MNT301", Password = "1234", Role = "Maintenance" },
            new User { Username = "OPR202", Password = "1234", Role = "Operator" }
        );

        db.SaveChanges();
    }

    if (!db.Alerts.Any())
    {
        db.Alerts.AddRange(
            new Alert { Machine = "Machine 3", Severity = "High", Message = "High temperature detected", Time = "10:30", Date = "2026-05-01", Acknowledged = false, Status = "Open", Role = "Operator", Response = 0 },
            new Alert { Machine = "Machine 6", Severity = "Medium", Message = "Load above safe limit", Time = "11:00", Date = "2026-05-01", Acknowledged = false, Status = "Open", Role = "Operator", Response = 0 },
            new Alert { Machine = "Machine 8", Severity = "High", Message = "RPM and temperature too high", Time = "11:30", Date = "2026-05-01", Acknowledged = true, Status = "Acknowledged", Role = "Maintenance", Response = 1 },
            new Alert { Machine = "Machine 12", Severity = "Medium", Message = "Temperature rising", Time = "12:00", Date = "2026-05-02", Acknowledged = false, Status = "Open", Role = "Operator", Response = 0 },
            new Alert { Machine = "Machine 15", Severity = "High", Message = "Critical load detected", Time = "13:15", Date = "2026-05-02", Acknowledged = true, Status = "Resolved", Role = "Maintenance", Response = 1 },
            new Alert { Machine = "Machine 19", Severity = "Low", Message = "Minor vibration detected", Time = "14:30", Date = "2026-05-03", Acknowledged = false, Status = "Open", Role = "Operator", Response = 0 }
        );

        db.SaveChanges();
    }

    if (!db.Downtimes.Any())
    {
        db.Downtimes.AddRange(
            new Downtime { Machine = "Machine 4", Date = "2026-05-01", From = "10:00", To = "12:00", Duration = "2 hours", Reason = "No Telemetry" },
            new Downtime { Machine = "Machine 9", Date = "2026-05-03", From = "09:00", To = "10:00", Duration = "1 hour", Reason = "Power Issue" },
            new Downtime { Machine = "Machine 13", Date = "2026-05-05", From = "14:00", To = "15:30", Duration = "1 hour 30 minutes", Reason = "Maintenance" },
            new Downtime { Machine = "Machine 17", Date = "2026-05-06", From = "11:00", To = "11:45", Duration = "45 minutes", Reason = "Network Issue" },
            new Downtime { Machine = "Machine 4", Date = "2026-05-08", From = "08:30", To = "09:30", Duration = "1 hour", Reason = "Calibration" },
            new Downtime { Machine = "Machine 9", Date = "2026-05-10", From = "15:00", To = "16:00", Duration = "1 hour", Reason = "Software Update" }
        );

        db.SaveChanges();
    }

    if (!db.Reports.Any())
    {
        db.Reports.AddRange(
            new Report { Type = "Downtime", Machine = "Machine 4", Date = "2026-05-01", Data = "No Telemetry", Value = 2.0m },
            new Report { Type = "Downtime", Machine = "Machine 9", Date = "2026-05-03", Data = "Power Issue", Value = 1.0m },
            new Report { Type = "Downtime", Machine = "Machine 13", Date = "2026-05-05", Data = "Maintenance", Value = 1.5m },
            new Report { Type = "Downtime", Machine = "Machine 17", Date = "2026-05-06", Data = "Network Issue", Value = 0.75m },
            new Report { Type = "Alert", Machine = "Machine 3", Date = "2026-05-01", Data = "High temperature detected", Value = 1 },
            new Report { Type = "Alert", Machine = "Machine 6", Date = "2026-05-01", Data = "Load above safe limit", Value = 1 },
            new Report { Type = "Alert", Machine = "Machine 8", Date = "2026-05-01", Data = "RPM and temperature too high", Value = 1 },
            new Report { Type = "Production", Machine = "Machine 1", Date = "2026-05-01", Data = "Units produced", Value = 1500 },
            new Report { Type = "Production", Machine = "Machine 2", Date = "2026-05-01", Data = "Units produced", Value = 1400 },
            new Report { Type = "Production", Machine = "Machine 3", Date = "2026-05-01", Data = "Units produced", Value = 1800 }
        );

        db.SaveChanges();
    }

    if (!db.Faults.Any())
    {
        db.Faults.AddRange(
            new Fault { Machine = "Machine 4", Severity = "High", Date = "2026-05-04", Description = "Sensor failure" },
            new Fault { Machine = "Machine 5", Severity = "Low", Date = "2026-05-05", Description = "Minor vibration" },
            new Fault { Machine = "Machine 6", Severity = "Medium", Date = "2026-05-06", Description = "Temperature spike" },
            new Fault { Machine = "Machine 7", Severity = "High", Date = "2026-05-07", Description = "Power surge" }
        );

        db.SaveChanges();
    }

    if (!db.PerformanceRecords.Any())
    {
        db.PerformanceRecords.AddRange(
            new PerformanceRecord { Machine = "Machine 1", Date = "2026-05-01", Temperature = 297, Load = 70 },
            new PerformanceRecord { Machine = "Machine 1", Date = "2026-05-02", Temperature = 299, Load = 72 },
            new PerformanceRecord { Machine = "Machine 2", Date = "2026-05-01", Temperature = 305, Load = 65 },
            new PerformanceRecord { Machine = "Machine 2", Date = "2026-05-02", Temperature = 302, Load = 68 },
            new PerformanceRecord { Machine = "Machine 3", Date = "2026-05-01", Temperature = 320, Load = 90 },
            new PerformanceRecord { Machine = "Machine 3", Date = "2026-05-02", Temperature = 318, Load = 89 }
        );

        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngularDev");
app.UseAuthorization();
app.MapControllers();
app.Run();
