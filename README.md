**Prerequisites**

.NET 8 SDK (or compatible version)

SQL Server (LocalDB or SQLEXPRESS)

Node.js (v16+) and npm

Angular CLI for Angular 17 (npm install -g @angular/cli)

**API Setup**
1. Update appsettings.Development.json with your local SQL Server connection string and JWT key
2. Run the API
3. Calls are made at https://localhost:44321/
4. The database will be automatically created and seeded with default accounts.


**WEB Setup**
1. npm install
2. ng serve
3. Default port: http://localhost:4200

| Role  | Email              | Password   |
|-------|------------------|-----------|
| Admin | admin@example.com | Admin123! |
| User  | user@example.com  | User123!  |


**Features**

Admin: Access Users page, view list, create/edit/delete users.

User: Access Home page with own details only.

CRUD operations automatically set CreatedAt, CreatedBy, ModifiedAt, ModifiedBy.

Validation for FullName, Email, Role, and Status enforced.

