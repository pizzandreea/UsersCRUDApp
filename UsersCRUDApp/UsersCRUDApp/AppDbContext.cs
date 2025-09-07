using Microsoft.EntityFrameworkCore;
using UsersCRUDApp.Models;

namespace UsersCRUDApp
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            //modelBuilder.Entity<User>()
            //    .Property(u => u.UserRole)
            //    .HasConversion<string>();

            //modelBuilder.Entity<User>()
            //    .Property(u => u.UserStatus)
            //    .HasConversion<string>();


            base.OnModelCreating(modelBuilder);
        }
    }
}
