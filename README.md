# Smart Factory Monitoring System

A web-based factory monitoring application designed to help users monitor industrial machines, manage alerts, track downtime, and analyze factory operations through a centralized dashboard.

**Project:** Smart Factory Monitoring System  
**Domain:** Industrial Monitoring / Smart Manufacturing  
**Training:** TCS Internship — Platform Domain  
**Frontend:** Angular 21  
**Backend:** ASP.NET Core Web API (.NET / C#)  
**Database:** SQLite local database (`smartfactory.db` — verify against the backend configuration)

---

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Sample Monitoring Scenarios](#sample-monitoring-scenarios)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## Overview

The Smart Factory Monitoring System is a web application developed to support the monitoring and management of industrial machine operations.

The application brings machine information, alerts, downtime records, employee information, and reports together in a centralized interface. It is intended to help factory administrators, supervisors, operators, and maintenance personnel access relevant operational information.

The application uses an Angular frontend and a .NET Web API backend. Factory data is stored in a local database, and a simulated dataset is used to represent machine monitoring scenarios.

## Objectives

- Monitor machine operating parameters such as temperature, RPM, load, and status.
- Identify abnormal operating conditions through alerts.
- Track machine downtime and record reasons for stoppages.
- Provide reports for machine performance and operational analysis.
- Support role-based access for different categories of factory users.
- Manage employee information and work-hour records.
- Present factory information through a centralized dashboard.

## Features

### 1. Machine Monitoring Dashboard

- View machine information and operating status.
- Display temperature, RPM, and load values where available.
- Identify machines with normal, alert, or offline status.
- Search and filter machine records.
- View a consolidated overview of factory operations.

### 2. Alert Management

- Display machine alerts with severity levels.
- Identify the machine associated with each alert.
- View alert messages and status.
- Filter alerts using available criteria such as severity, machine, date, and status.
- Support alert acknowledgement and closure according to user permissions.

### 3. Downtime Tracking

- Maintain records of machine downtime events.
- Record downtime reasons and relevant time information.
- Track stoppages and review downtime records.
- Support downtime summaries for operational analysis.

### 4. Reports and Analytics

- Review machine performance information.
- Analyze alert records and downtime information.
- Filter records by available reporting criteria.
- Support operational reporting using stored application data.

### 5. User Management

- Manage user records according to administrator permissions.
- Assign roles and departments where supported.
- Restrict access to authorized application functions.

### 6. Employee Management

- Maintain employee information.
- Track work-hour and leave-related records.
- Search and filter employee records.

## Technology Stack

| Technology | Purpose |
|---|---|
| Angular 21 | Frontend application and user interface |
| TypeScript, HTML, CSS | Frontend logic, structure, and styling |
| ASP.NET Core Web API | Backend services and business logic |
| C# | Backend implementation |
| Entity Framework Core | Database access and ORM, as reflected in backend logs |
| SQLite | Local database file visible in the project |
| JWT authentication | Token-based authentication, as described in the project design |
| Git and GitHub | Version control and source-code hosting |

> **Database note:** The project presentation refers to SQL Server, while the local project screenshot shows `smartfactory.db` and the backend logs show Entity Framework Core commands. Confirm the configured database provider in `backend/Program.cs`, `backend/appsettings.json`, and `backend/backend.csproj` before documenting SQL Server as the active database.

## System Architecture

The application follows a frontend–backend architecture.

```text
+-----------------------------+
|       User / Browser        |
+-----------------------------+
              |
              v
+-----------------------------+
|       Angular Frontend      |
| Dashboard, Alerts, Reports  |
| Users, Employees, Downtime  |
+-----------------------------+
              |
              | HTTP / API Requests
              v
+-----------------------------+
|    ASP.NET Core Web API     |
| Business Logic and Access   |
| Control (where configured)  |
+-----------------------------+
              |
              v
+-----------------------------+
|       Application DB        |
|       smartfactory.db       |
+-----------------------------+

      Simulated Machine Data
                 |
                 v
       Application Data Source
```

The diagram represents the logical application flow. The precise mechanism used to supply machine data and the authentication flow should be verified against the implemented source code.

## Database Design

The project database contains tables for the application's main operational modules.

| Table | Purpose |
|---|---|
| `Machines` | Machine information and operating details |
| `Alerts` | Alert messages, severity, timestamps, and acknowledgement information |
| `Downtimes` | Machine downtime events and related records |
| `Employees` | Employee information and work-related records |
| `Users` | User accounts and role-related information |
| `Faults` | Machine fault records |
| `PerformanceRecords` | Machine performance information |
| `Reports` | Report-related application records |

The exact columns and relationships depend on the entity models and database configuration in the backend.

## Project Structure

```text
smart-factory/
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Properties/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── backend.csproj
│   └── smartfactory.db
├── public/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── package-lock.json
├── BACKEND_SETUP.md
├── DEPLOYMENT_GUIDE.md
└── README.md
```

*Note: This is a simplified view of the project structure. Some folders and files may contain additional modules.*

## Prerequisites

Install the following tools before running the project:

- [Node.js and npm](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli), if required by the project
- [.NET SDK](https://dotnet.microsoft.com/download)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

Check the installed versions:

```bash
node --version
npm --version
dotnet --version
git --version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Vinisri-M/Smart_factory.git
cd Smart_factory
```

### 2. Set up the backend

Open a terminal in the project root and run:

```bash
cd backend
dotnet restore
dotnet build
```

Run the backend:

```bash
dotnet run
```

The backend was previously observed running at:

```text
http://localhost:5248
```

The actual address may differ depending on the launch settings. Check the terminal output for the active URL.

### 3. Set up the frontend

Open a **second terminal** in the project root:

```bash
npm install
```

Start the Angular development server:

```bash
npm start
```

If the `start` script is not defined in `package.json`, use the project's configured Angular command, for example:

```bash
npx ng serve
```

Open the local URL printed by Angular in your browser. A common default is:

```text
http://localhost:4200
```

### 4. Verify the application

- Confirm that the backend starts without errors.
- Confirm that the Angular application compiles successfully.
- Check that the frontend can reach the backend API.
- Verify that machine, alert, downtime, and other records load correctly.
- Test the application's access restrictions using the configured user roles.

**Important:** The database must be initialized and configured as expected by the backend. Review `BACKEND_SETUP.md` and the application configuration if startup or database errors occur.

## Sample Monitoring Scenarios

The local database screenshot contains example alert records such as:

| Machine | Severity | Example alert |
|---|---|---|
| Machine 3 | High | High temperature detected |
| Machine 6 | Medium | Load above safe limit |
| Machine 8 | High | RPM and temperature too high |
| Machine 12 | Medium | Temperature rising |
| Machine 15 | High | Critical load detected |
| Machine 19 | Low | Minor vibration detected |

These records illustrate the monitoring scenarios represented in the local database. They should not be interpreted as measurements from a live industrial installation.

## Security Considerations

For a production-ready deployment:

- Store passwords using a secure password-hashing mechanism.
- Keep connection strings, credentials, signing keys, and other secrets out of source control.
- Validate authentication and authorization on the backend, not only in the frontend.
- Apply role-based authorization to protected API endpoints.
- Validate and sanitize incoming data.
- Use HTTPS for deployed environments.
- Avoid publishing real employee information or sensitive operational data.
- Review the repository for secrets and sensitive database contents before making it public.

## Future Enhancements

Potential enhancements include:

- Integration with live industrial sensors or an IoT data source.
- Real-time machine updates using an appropriate streaming mechanism.
- Advanced predictive maintenance and anomaly detection.
- Additional performance visualizations and exportable reports.
- Cloud deployment with secure configuration and monitoring.
- Automated testing and continuous integration using GitHub Actions.

These are proposed enhancements and should not be considered implemented features unless supported by the source code.

## Author

**Vinisri M**

Smart Factory Monitoring System — TCS Internship, Platform Domain.

GitHub: [Vinisri-M](https://github.com/Vinisri-M)

---

*This repository is intended for project demonstration and learning. Refer to the source code and setup documentation for the exact configuration and implemented capabilities.*
