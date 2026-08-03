using Course_system.Models;
using Course_system.Repository;
using static Course_system.DTOs.UserDto;

namespace Course_system.Service
{
    public class UserService
    {
        private UserRepository userRepo;
        private AuthService authService;

        public UserService(UserRepository _userRepo, AuthService _authService)
        {
            userRepo = _userRepo;
            authService = _authService;
        }

        // ── Register ──────────────────────────────────────────────────────────
        public UserResponseDto Register(RegisterDto dto)
        {
            // Business rule: email must not already be registered
            if (userRepo.EmailExists(dto.Email))
                return null;

            User user = new User();
            user.Username = dto.Username;
            user.Email = dto.Email;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            user.Role = dto.Role;

            userRepo.Add(user);

            UserResponseDto response = new UserResponseDto();
            response.Id = user.Id;
            response.Username = user.Username;
            response.Email = user.Email;
            response.Role = user.Role;

            return response;
        }

        // ── Login ─────────────────────────────────────────────────────────────
        public LoginResponseDto Login(LoginDto dto)
        {
            User user = userRepo.GetByEmail(dto.Email);
            if (user == null)
                return null;

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!validPassword)
                return null;

            // Credentials valid — delegate token generation to AuthService
            string token = authService.GenerateToken(user);

            LoginResponseDto response = new LoginResponseDto();
            response.Token = token;
            response.Username = user.Username;
            response.Role = user.Role;

            return response;
        }

        // ── Get user data ─────────────────────────────────────────────────────
        public UserResponseDto GetById(int id)
        {
            User user = userRepo.GetById(id);
            if (user == null)
                return null;

            UserResponseDto response = new UserResponseDto();
            response.Id = user.Id;
            response.Username = user.Username;
            response.Email = user.Email;
            response.Role = user.Role;

            return response;
        }

        // ── Update user data ──────────────────────────────────────────────────
        public UserResponseDto Update(int id, UpdateUserDto dto)
        {
            User user = userRepo.GetById(id);
            if (user == null)
                return null;

            user.Username = dto.Username;
            user.Email = dto.Email;

            userRepo.Update();

            UserResponseDto response = new UserResponseDto();
            response.Id = user.Id;
            response.Username = user.Username;
            response.Email = user.Email;
            response.Role = user.Role;

            return response;
        }

        // ── Delete user ───────────────────────────────────────────────────────
        public bool Delete(int id)
        {
            User user = userRepo.GetById(id);
            if (user == null)
                return false;

            userRepo.Delete(user);
            return true;
        }
    }
}
