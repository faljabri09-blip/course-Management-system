using System.ComponentModel.DataAnnotations;

namespace Course_system.DTOs
{
    public class UserDto
    {
        public class RegisterDto
        {
            [Required(ErrorMessage = "Username is required.")]
            [MaxLength(50)]
            public string Username { get; set; }

            [Required(ErrorMessage = "Email is required.")]
            [MaxLength(150)]
            [EmailAddress(ErrorMessage = "Invalid email format.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Password is required.")]
            [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
            public string Password { get; set; }

            [Required(ErrorMessage = "Role is required.")]
            public string Role { get; set; }               // Client or Admin
        }

        public class LoginDto
        {
            [Required(ErrorMessage = "Email is required.")]
            [EmailAddress(ErrorMessage = "Invalid email format.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Password is required.")]
            public string Password { get; set; }
        }

        public class UpdateUserDto
        {
            [Required(ErrorMessage = "Username is required.")]
            [MaxLength(50)]
            public string Username { get; set; }

            [Required(ErrorMessage = "Email is required.")]
            [MaxLength(150)]
            [EmailAddress(ErrorMessage = "Invalid email format.")]
            public string Email { get; set; }
        }

        // ── Response DTOs — what the API sends back ───────────────────────────────

        public class UserResponseDto
        {
            public int Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            // no PasswordHash — never expose it in a response
        }

        public class LoginResponseDto
        {
            public string Token { get; set; }
            public string Username { get; set; }
            public string Role { get; set; }
        }
    }
}
