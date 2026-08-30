using CourseManagementSystem.Data;
using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CourseManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CourseContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            CourseContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        // =====================================================
        // REGISTER
        // =====================================================

        [HttpPost("register")]
        public IActionResult Register(RegisterDto model)
        {
            // -------------------------------------------------
            // Check existing username or email
            // -------------------------------------------------

            var existingUser = _context.Users
                .FirstOrDefault(x =>
                    x.Username == model.Username ||
                    x.Email == model.Email);

            if (existingUser != null)
            {
                return BadRequest(
                    "Username or Email already exists"
                );
            }


            // -------------------------------------------------
            // Normalize Role
            // -------------------------------------------------

            var role = NormalizeRole(model.Role);

            if (role == null)
            {
                return BadRequest(
                    "Invalid role. Allowed roles are Admin, Instructor, Student."
                );
            }


            // -------------------------------------------------
            // Create User
            // -------------------------------------------------

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                Password = model.Password,
                Role = role
            };


            // -------------------------------------------------
            // Save User
            // -------------------------------------------------

            _context.Users.Add(user);

            _context.SaveChanges();


            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            return Ok(
                "User registered successfully"
            );
        }


        // =====================================================
        // LOGIN
        // =====================================================

        [HttpPost("login")]
        public IActionResult Login(LoginDto model)
        {
            // -------------------------------------------------
            // Find User
            // -------------------------------------------------

            var user = _context.Users
                .FirstOrDefault(x =>
                    x.Username == model.Username &&
                    x.Password == model.Password);


            // -------------------------------------------------
            // User Not Found
            // -------------------------------------------------

            if (user == null)
            {
                return Unauthorized(
                    "Invalid username or password"
                );
            }


            // =================================================
            // NORMALIZE ROLE
            // =================================================

            var role = NormalizeRole(user.Role);


            // -------------------------------------------------
            // Invalid Role
            // -------------------------------------------------

            if (role == null)
            {
                return Unauthorized(
                    "Invalid user role"
                );
            }


            // =================================================
            // CLAIMS
            // =================================================

            var claims = new[]
            {
                // -------------------------------------------------
                // Username
                // -------------------------------------------------

                new Claim(
                    ClaimTypes.Name,
                    user.Username
                ),


                // -------------------------------------------------
                // Role
                // -------------------------------------------------

                new Claim(
                    ClaimTypes.Role,
                    role
                ),


                // -------------------------------------------------
                // User ID
                // -------------------------------------------------

                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString()
                )
            };


            // =================================================
            // JWT KEY
            // =================================================

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!
                )
            );


            // =================================================
            // CREDENTIALS
            // =================================================

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );


            // =================================================
            // CREATE TOKEN
            // =================================================

            var token = new JwtSecurityToken(
                issuer:
                    _configuration["Jwt:Issuer"],

                audience:
                    _configuration["Jwt:Audience"],

                claims:
                    claims,

                expires:
                    DateTime.Now.AddHours(1),

                signingCredentials:
                    credentials
            );


            // =================================================
            // STUDENT ID
            // =================================================

            int? studentId = null;

            if (role == "Student")
            {
                studentId = user.Id;
            }


            // =================================================
            // RETURN RESPONSE
            // =================================================

            return Ok(
                new
                {
                    token =
                        new JwtSecurityTokenHandler()
                            .WriteToken(token),

                    username =
                        user.Username,

                    role =
                        role,

                    studentId =
                        studentId
                }
            );
        }


        // =====================================================
        // NORMALIZE ROLE
        // =====================================================

        private string? NormalizeRole(
            string? role)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return null;
            }


            // -------------------------------------------------
            // Remove spaces
            // -------------------------------------------------

            role = role.Trim();


            // -------------------------------------------------
            // Student
            // -------------------------------------------------

            if (
                string.Equals(
                    role,
                    "student",
                    StringComparison.OrdinalIgnoreCase
                )
            )
            {
                return "Student";
            }


            // -------------------------------------------------
            // Instructor
            // -------------------------------------------------

            if (
                string.Equals(
                    role,
                    "instructor",
                    StringComparison.OrdinalIgnoreCase
                )
            )
            {
                return "Instructor";
            }


            // -------------------------------------------------
            // Admin
            // -------------------------------------------------

            if (
                string.Equals(
                    role,
                    "admin",
                    StringComparison.OrdinalIgnoreCase
                )
            )
            {
                return "Admin";
            }


            // -------------------------------------------------
            // Invalid
            // -------------------------------------------------

            return null;
        }
    }
}