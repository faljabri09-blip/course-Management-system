using Course_system;
using Course_system.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly CourseContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(CourseContext context,
                          IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login(Login model)
    {
        var user = _context.Users.FirstOrDefault(x =>
            x.Username == model.Username &&
            x.Password == model.Password);

        if (user == null)
            return Unauthorized();

        var claims = new[]
        {
            new Claim(ClaimTypes.Name,user.Username),
            new Claim(ClaimTypes.Role,user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

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
            Token = new JwtSecurityTokenHandler().WriteToken(token)
        });
    }
}