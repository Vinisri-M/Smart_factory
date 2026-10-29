# Smart Factory Backend Setup Guide

## Overview
This .NET Web API backend integrates with your Angular frontend dashboard to provide employee data from SQLite database.

## Project Structure
```
backend/
├── Models/           # Data models (Employee)
├── Data/             # Database context (AppDbContext)
├── Controllers/      # API endpoints (EmployeesController)
├── Program.cs        # Startup configuration
├── appsettings.json  # Database and logging configuration
└── backend.csproj    # Project file
```

## Key Components

### 1. Database: SQLite
- **Location**: `smartfactory.db` (created in backend root when first run)
- **Connection String**: `Data Source=smartfactory.db`
- **Why SQLite**: Lightweight, file-based, no external server needed

### 2. Data Model (Employee)
```csharp
public class Employee {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Role { get; set; }
    public string Department { get; set; }
}
```

### 3. API Endpoints

#### `GET /api/employees`
Returns list of all employees from the database.

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "role": "Supervisor",
    "department": "Assembly"
  },
  {
    "id": 2,
    "name": "Boris Lee",
    "role": "Operator",
    "department": "Packaging"
  }
]
```

**Default Data** (loaded on first run):
- Alice Johnson - Supervisor - Assembly
- Boris Lee - Operator - Packaging
- Carmen Silva - Maintenance - Mechanical
- Diego Reyes - Administrator - Controls

## How It Works

### Backend Process
1. **Startup**: When the API runs, `Program.cs` sets up:
   - Entity Framework Core with SQLite
   - CORS policy to allow Angular frontend (`http://localhost:4200`)
   - Database initialization (creates/seeds if needed)

2. **Database Creation**: On first run:
   - SQLite database file (`smartfactory.db`) is created
   - Employee table is created
   - 4 default employees are inserted

3. **API Ready**: Backend listens on `http://localhost:5000` (or configured port)

### Frontend Integration
1. **Angular Service**: `EmployeeService` calls `/api/employees`
2. **Dashboard Component**: Loads employees on initialization
3. **Display**: Employee table shown in dashboard page

## Running the Backend

### Option 1: From Source (Recommended)
```bash
cd c:\Users\ASUS\Desktop\smart-factory\backend
dotnet run
```

### Option 2: Run Compiled Binary
```bash
cd c:\Users\ASUS\Desktop\smart-factory\backend\bin\Debug\net10.0
.\backend.exe
```

### Expected Output
When successful, you should see:
- Application starting on `http://localhost:5000`
- Database operations messages
- Ready for requests

## Testing the API

### Using cURL
```bash
curl http://localhost:5000/api/employees
```

### Using PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/employees | ConvertFrom-Json | ConvertTo-Json
```

### From Angular
The dashboard will automatically fetch employee data when you navigate to it after logging in.

## Configuration

### Port
To run on a different port:
```bash
dotnet run --urls http://localhost:5555
```

Then update Angular service to match:
```typescript
// In src/app/services/employee.ts
apiUrl = 'http://localhost:5555/api/employees';
```

### Database
To use a different database, modify `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=C:\\path\\to\\database.db"
}
```

## Development Workflow

### Start Backend
```bash
cd backend
dotnet run
```

### Start Frontend (separate terminal)
```bash
npm start
```

### Access Application
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:5000`
- OpenAPI (Swagger): `http://localhost:5000/openapi/v1.json` (Development only)

## Adding More Endpoints

To add new API endpoints:

1. **Create Model** in `Models/` folder
2. **Add DbSet** to `AppDbContext` in `Data/AppDbContext.cs`
3. **Create Controller** in `Controllers/` folder
4. **Update Angular Service** to call new endpoint

Example: Create Users endpoint
```csharp
// Models/User.cs
public class User {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Role { get; set; }
}

// Data/AppDbContext.cs
public DbSet<User> Users { get; set; }

// Controllers/UsersController.cs
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase {
    private readonly AppDbContext _db;
    
    public UsersController(AppDbContext db) => _db = db;
    
    [HttpGet]
    public async Task<IActionResult> GetUsers() =>
        Ok(await _db.Users.ToListAsync());
}
```

## Troubleshooting

### Error: "Could not find a project"
- Ensure you're in the `backend/` directory
- Run: `dotnet build` to verify compilation

### Error: "Connection refused"
- Check backend is running on correct port
- Run: `curl http://localhost:5000/api/employees` to test

### Empty employee list
- Database may not have initialized
- Delete `smartfactory.db` and restart backend
- Restart backend will recreate and seed database

### CORS errors in browser console
- Verify CORS policy is configured correctly in `Program.cs`
- Check Angular service URL matches backend URL

## Next Steps

1. **Add Authentication**: Implement JWT tokens for secure login
2. **Expand Database**: Add machine data, alerts, downtime records
3. **Add More APIs**: Create endpoints for all dashboard features
4. **Deployment**: Deploy to Azure App Service or AWS

## Technologies Used

- **.NET 10.0**: Server runtime
- **ASP.NET Core**: Web framework
- **Entity Framework Core**: ORM
- **SQLite**: Database
- **CORS**: Cross-origin requests
- **OpenAPI**: API documentation (dev only)

## Additional Resources

- [ASP.NET Core Docs](https://learn.microsoft.com/aspnet/core)
- [Entity Framework Core](https://learn.microsoft.com/ef/core)
- [SQLite Documentation](https://www.sqlite.org)
