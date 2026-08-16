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

        [HttpPost("register")]
        public IActionResult Register(RegisterDto model)
        {
            var existingUser = _context.Users
                .FirstOrDefault(x =>
                    x.Username == model.Username ||
                    x.Email == model.Email);

            if (existingUser != null)
            {
                return BadRequest("Username or Email already exists");
            }

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                Password = model.Password,
                Role = model.Role
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto model)
        {
            var user = _context.Users.FirstOrDefault(x =>
                x.Username == model.Username &&
                x.Password == model.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.Name,
                    user.Username),

                new Claim(
                    ClaimTypes.Role,
                    user.Role),

                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler()
                    .WriteToken(token),

                username = user.Username,

                role = user.Role
            });
        }
    }
}