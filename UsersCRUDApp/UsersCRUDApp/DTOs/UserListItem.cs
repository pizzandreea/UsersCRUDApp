using UsersCRUDApp.Enums;

namespace UsersCRUDApp.DTOs
{
    public class UserListItem
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = default!;

        public string Email { get; set; } = default!;

        public UserRole UserRole { get; set; } = default!;

        public UserStatus UserStatus { get; set; } = default!;

        public DateTimeOffset CreatedAt { get; set; }

        public string? CreatedBy { get; set; }

        public DateTimeOffset? ModifiedAt { get; set; }

        public string? ModifiedBy { get; set; }
    }
}
