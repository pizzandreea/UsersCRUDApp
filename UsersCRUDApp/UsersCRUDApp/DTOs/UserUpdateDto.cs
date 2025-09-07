using System.ComponentModel.DataAnnotations;
using UsersCRUDApp.Enums;

namespace UsersCRUDApp.DTOs
{
    public class UserUpdateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FullName { get; set; } = default!;

        [Required]
        public UserRole UserRole { get; set; } = UserRole.User;

        [Required]
        public UserStatus UserStatus { get; set; } = UserStatus.Active;

        public string? Password { get; set; }
    }
}
