using Course_system.Repository;
using Course_system.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using System.Text;

namespace Course_system
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Database
            builder.Services.AddDbContext<CourseContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // Repositories
            builder.Services.AddScoped<StudentRepository>();
            builder.Services.AddScoped<InstructorRepository>();
            builder.Services.AddScoped<UserRepository>();
            builder.Services.AddScoped<CourseRepository>();
            builder.Services.AddScoped<EnrollmentRepository>();

            // Services
            builder.Services.AddScoped<StudentService>();
            builder.Services.AddScoped<InstructorService>();
            builder.Services.AddScoped<CourseService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<EnrollmentService>();

            //// Authentication Service
            builder.Services.AddScoped<AuthService>();

            // JWT Authentication

            // قراءة JwtSettings من appsettings.json
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");

            var jwtKey = builder.Configuration["JwtSettings:SecretKey"];
            var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
            var jwtAudience = builder.Configuration["JwtSettings:Audience"];

            builder.Services.AddAuthentication("Bearer")
     .AddJwtBearer(options =>
     {
         options.TokenValidationParameters = new TokenValidationParameters
         {
             ValidateIssuer = true,
             ValidateAudience = true,
             ValidateLifetime = true,
             ValidateIssuerSigningKey = true,
             ValidIssuer = jwtSettings["Issuer"],
             ValidAudience = jwtSettings["Audience"],
             IssuerSigningKey = new SymmetricSecurityKey(
                 Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]))
         };
     });



            builder.Services.AddAuthorization();
          

            builder.Services.AddControllers();

            // ── Swagger with JWT support ───────────────────────────────────────
            builder.Services.AddEndpointsApiExplorer();
            //  builder.Services.AddSwaggerGen();


            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your JWT token in the box below"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
            });

            var app = builder.Build(); //end line of service container
            ////////////////////////////////////////////////////////////////////


            // Configure the HTTP request pipeline / middleware pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            //jwt
            app.UseAuthentication();  // ← must be before UseAuthorization
            app.UseAuthorization();
            //jwt


            app.MapControllers();

            // run application
            app.Run();
        }
    }
}