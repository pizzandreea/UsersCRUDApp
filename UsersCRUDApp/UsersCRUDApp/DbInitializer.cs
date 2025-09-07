using System.Data;
using UsersCRUDApp.Enums;
using UsersCRUDApp.Models;

namespace UsersCRUDApp
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Users.Any())
            {
                var admin = new User
                {
                    FullName = "Admin User",
                    Email = "admin@example.com",
                    UserRole = UserRole.Admin,       
                    UserStatus = UserStatus.Active,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    CreatedBy = "System",
                    ModifiedBy = "System"
                };

                var user = new User
                {
                    FullName = "Regular User",
                    Email = "user@example.com",
                    UserRole = UserRole.User,
                    UserStatus = UserStatus.Active,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                    CreatedBy = "System",
                    ModifiedBy = "System"
                };

                context.Users.AddRange(admin, user);
                context.SaveChanges();
            }
        }

    }
}
