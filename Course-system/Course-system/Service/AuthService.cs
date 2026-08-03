using Course_system.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Course_system.Service
{
    public class AuthService
    {
        private IConfiguration config;

        public AuthService(IConfiguration _config)
        {
            config = _config;
        }

        public string GenerateToken(User user)
        {
            string secretKey = config["JwtSettings:SecretKey"]; //1
            string issuer = config["JwtSettings:Issuer"];
            string audience = config["JwtSettings:Audience"];
            int hours = int.Parse(config["JwtSettings:ExpiryHours"]);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            Claim[] claims =
            {
                new Claim("sub",   user.Username),
                new Claim("userId", user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("role",  user.Role),   // ← plain "role" string, NOT ClaimTypes.Role
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(hours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
