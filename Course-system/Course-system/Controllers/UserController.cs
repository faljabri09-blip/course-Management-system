using Course_system.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Course_system.DTOs.UserDto;

namespace FirstWebApp.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private UserService userService;

        public UserController(UserService _userService)
        {
            userService = _userService;
        }

        // POST user/register
        // Public — no token required
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            UserResponseDto created = userService.Register(dto);

            if (created == null)
                return BadRequest(new { message = "Email is already registered." });

            return Ok(created);
        }

        // POST user/login
        // Public — returns the JWT token on success
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            LoginResponseDto result = userService.Login(dto);

            if (result == null)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(result);
        }

        // GET user/GetUserData/3
        // Protected — any authenticated user (Buyer or Seller)
        [HttpGet("GetUserData/{id}")]
        [Authorize(Roles = "Buyer,Seller")]
        public IActionResult GetUserData(int id)
        {
            UserResponseDto user = userService.GetById(id);

            if (user == null)
                return NotFound(new { message = $"User with ID {id} was not found." });

            return Ok(user);
        }

        // PUT user/UpdateUserData/3
        // Protected — any authenticated user (Buyer or Seller)
        [HttpPut("UpdateUserData/{id}")]
        [Authorize(Roles = "Buyer,Seller")]
        public IActionResult UpdateUserData(int id, [FromBody] UpdateUserDto dto)
        {
            UserResponseDto updated = userService.Update(id, dto);

            if (updated == null)
                return NotFound(new { message = $"User with ID {id} was not found." });

            return Ok(updated);
        }

        // DELETE user/DeleteUser/3
        // Protected — any authenticated user (Buyer or Seller)
        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Buyer,Seller")]
        public IActionResult DeleteUser(int id)
        {
            bool deleted = userService.Delete(id);

            if (!deleted)
                return NotFound(new { message = $"User with ID {id} was not found." });

            return NoContent();
        }

        [ApiController]
        [Route("api/[controller]")]
        public class AuthController : ControllerBase
        {
            [HttpPost("login")]
            public IActionResult Login(string username, string password)
            {
                // تحقق من بيانات الدخول (مثال بسيط)
                if (username == "admin" && password == "123")
                {
                    var claims = new[]
                    {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKeyHere12345"));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: "https://localhost:7108",
                        audience: "https://localhost:7108",
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(30),
                        signingCredentials: creds);

                    return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
                }

                return Unauthorized();
            }
        }

    }
}
