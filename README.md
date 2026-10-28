# CivicFix — Community Issue Reporting Platform

CivicFix is a full-stack web application designed to help communities report local problems and track reported issues.

The project is being developed as a practical portfolio project using Java full-stack technologies.

## Features

- Modern, responsive frontend interface
- Submit community issue reports
- View issues retrieved from the backend API
- Store issue reports in a MySQL database
- Generate issue reference IDs using the saved record IDs
- Display issue categories, locations, descriptions, statuses, and creation dates
- Loading and error handling for issue retrieval

> **Current development status:** Issue submission and issue listing are implemented and have been tested locally. Authentication, role-based access, and the complete administrative resolution workflow are not yet implemented.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML and CSS

### Backend
- Java
- Spring Boot
- Maven
- REST API

### Database
- MySQL

## Project Structure

```text
CivicFix/
├── .github/
├── backend/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Java Development Kit
- Node.js and npm
- MySQL Server

## Database Setup

1. Start MySQL Server.
2. Create the project database:

```sql
CREATE DATABASE IF NOT EXISTS civicfix_db;
```

3. Configure the backend database connection and MySQL username in the backend configuration.
4. Provide your MySQL password through the `DB_PASSWORD` environment variable when starting the backend.

Never commit database passwords or other secrets to GitHub.

## Run the Backend

Open a PowerShell terminal:

```powershell
cd backend
$env:DB_PASSWORD = Read-Host "Enter your MySQL password"
.\mvnw.cmd spring-boot:run
```

Keep this terminal open while using the application.

The backend API is available locally at:

`http://localhost:8080`

## Run the Frontend

Open a second PowerShell terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

Keep both the frontend and backend running during local development.

## API Endpoint

### Get all issues

```http
GET /api/issues
```

Returns the saved issue records.

### Create an issue

```http
POST /api/issues
Content-Type: application/json
```

Example request body:

```json
{
  "title": "Broken streetlight near community park",
  "category": "Street lighting",
  "location": "Hyderabad",
  "description": "The streetlight is not working."
}
```

The API returns the created issue, including its generated ID and status.

## Current Issue Statuses

Issue records returned by the API currently use the `REPORTED` status. Additional workflow statuses may be used as the project develops.

## Build the Frontend

```powershell
cd frontend
npm.cmd run build
```

The production build is generated in the frontend `dist/` directory.

## Development Roadmap

- [x] Frontend foundation
- [x] Spring Boot backend foundation
- [x] Frontend and API integration
- [x] Verify issue submission and retrieval
- [ ] Issue search, filtering, and sorting
- [ ] User registration and authentication
- [ ] Role-based access and administration
- [ ] Issue status updates and resolution workflow
- [ ] Deployment

## Repository

GitHub: https://github.com/abdulshoib/civicfix

---

Built as a learning and portfolio project.
