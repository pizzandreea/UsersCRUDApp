using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UsersCRUDApp.DTOs;
using UsersCRUDApp.Models;

namespace UsersCRUDApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public UsersController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.Role, user.UserRole.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(tokenHandler.WriteToken(token));
        }


        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IEnumerable<UserListItem>> GetAll()
        {
            return await _db.Users.AsNoTracking()
                .OrderBy(u => u.FullName)
                .Select(u => new UserListItem
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    UserRole = u.UserRole,
                    UserStatus = u.UserStatus,
                    CreatedAt = u.CreatedAt,
                    CreatedBy = u.CreatedBy,
                    ModifiedAt = u.ModifiedAt,
                    ModifiedBy = u.ModifiedBy
                }).ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserListItem>> GetById(Guid id)
        {
            var u = await _db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (u == null) return NotFound();

            return new UserListItem
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                UserRole = u.UserRole,
                UserStatus = u.UserStatus,
                CreatedAt = u.CreatedAt,
                CreatedBy = u.CreatedBy,
                ModifiedAt = u.ModifiedAt,
                ModifiedBy = u.ModifiedBy
            };

        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserListItem>> Create(UserCreateDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return Conflict(new { message = "Email already exists" });

            var creator = User.Identity?.Name ?? "System";

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                UserRole = dto.UserRole,
                UserStatus = dto.UserStatus,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedBy = creator
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var item = new UserListItem
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                UserRole = user.UserRole,
                UserStatus = user.UserStatus,
                CreatedAt = user.CreatedAt,
                CreatedBy = user.CreatedBy,
                ModifiedAt = user.ModifiedAt,
                ModifiedBy = user.ModifiedBy
            };


            return CreatedAtAction(nameof(GetById), new { id = user.Id }, item);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, UserUpdateDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.FullName = dto.FullName;
            user.UserRole = dto.UserRole;
            user.UserStatus = dto.UserStatus;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            user.ModifiedBy = User.Identity?.Name ?? user.ModifiedBy;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserListItem>> Me()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var u = await _db.Users.AsNoTracking().SingleOrDefaultAsync(x => x.Email == email);
            if (u == null) return NotFound();

            return new UserListItem
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                UserRole = u.UserRole,
                UserStatus = u.UserStatus,
                CreatedAt = u.CreatedAt,
                CreatedBy = u.CreatedBy,
                ModifiedAt = u.ModifiedAt,
                ModifiedBy = u.ModifiedBy
            };

        }
    }
}
