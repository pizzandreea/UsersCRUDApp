using System.ComponentModel.DataAnnotations;
using UsersCRUDApp.Enums;

namespace UsersCRUDApp.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [StringLength(100, MinimumLength = 2)]
        [Required]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        public DateTimeOffset? ModifiedAt { get; set; }
        public string? ModifiedBy { get; set; }
        [Required]
        public UserRole UserRole { get; set; } = UserRole.User;

        [Required]
        public UserStatus UserStatus { get; set; } = UserStatus.Active;

        [Required]
        public string PasswordHash { get; set; } = default!;
    }


}
