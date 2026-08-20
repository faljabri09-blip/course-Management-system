using CourseManagementSystem.Data;
using CourseManagementSystem.Repositories;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace CourseManagementSystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // =========================================
            // Controllers
            // =========================================

            builder.Services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler =
                        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });


            // =========================================
            // Database
            // =========================================

            builder.Services.AddDbContext<CourseContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                ));


            // =========================================
            // CORS
            // =========================================

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy
                        .SetIsOriginAllowed(origin =>
                        {
                            if (Uri.TryCreate(
                                origin,
                                UriKind.Absolute,
                                out var uri))
                            {
                                return uri.Host.Equals(
                                    "localhost",
                                    StringComparison.OrdinalIgnoreCase
                                );
                            }

                            return false;
                        })
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });


            // =========================================
            // Repositories
            // =========================================

            builder.Services.AddScoped<CourseRepository>();
            builder.Services.AddScoped<StudentRepository>();
            builder.Services.AddScoped<EnrollmentRepository>();
            builder.Services.AddScoped<InstructorRepository>();


            // =========================================
            // Services
            // =========================================

            builder.Services.AddScoped<CourseService>();
            builder.Services.AddScoped<StudentService>();
            builder.Services.AddScoped<EnrollmentService>();
            builder.Services.AddScoped<InstructorService>();


            // =========================================
            // JWT Settings
            // =========================================

            var jwtKey = builder.Configuration["Jwt:Key"];
            var jwtIssuer = builder.Configuration["Jwt:Issuer"];
            var jwtAudience = builder.Configuration["Jwt:Audience"];


            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                throw new Exception(
                    "JWT Key is missing from appsettings.json"
                );
            }

            if (string.IsNullOrWhiteSpace(jwtIssuer))
            {
                throw new Exception(
                    "JWT Issuer is missing from appsettings.json"
                );
            }

            if (string.IsNullOrWhiteSpace(jwtAudience))
            {
                throw new Exception(
                    "JWT Audience is missing from appsettings.json"
                );
            }


            // =========================================
            // Authentication
            // =========================================

            builder.Services
                .AddAuthentication(
                    JwtBearerDefaults.AuthenticationScheme
                )
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                        new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,

                            IssuerSigningKey =
                                new SymmetricSecurityKey(
                                    Encoding.UTF8.GetBytes(jwtKey)
                                ),

                            ValidateIssuer = true,

                            ValidIssuer = jwtIssuer,

                            ValidateAudience = true,

                            ValidAudience = jwtAudience,

                            ValidateLifetime = true,

                            ClockSkew = TimeSpan.Zero
                        };


                    // =====================================
                    // JWT Error Debugging
                    // =====================================

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine();
                            Console.WriteLine(
                                "=============================================="
                            );

                            Console.WriteLine(
                                "JWT AUTHENTICATION FAILED"
                            );

                            Console.WriteLine(
                                context.Exception.ToString()
                            );

                            Console.WriteLine(
                                "=============================================="
                            );

                            Console.WriteLine();

                            return Task.CompletedTask;
                        }
                    };
                });


            // =========================================
            // Authorization
            // =========================================

            builder.Services.AddAuthorization();


            // =========================================
            // Swagger
            // =========================================

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(
                    "v1",
                    new OpenApiInfo
                    {
                        Title = "Course Management System API",
                        Version = "v1"
                    }
                );


                // =====================================
                // Bearer Authentication
                // =====================================

                options.AddSecurityDefinition(
                    "Bearer",
                    new OpenApiSecurityScheme
                    {
                        Name = "Authorization",

                        Type = SecuritySchemeType.Http,

                        Scheme = "bearer",

                        BearerFormat = "JWT",

                        In = ParameterLocation.Header,

                        Description =
                            "Enter your JWT token"
                    }
                );


                options.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference =
                                    new OpenApiReference
                                    {
                                        Type =
                                            ReferenceType.SecurityScheme,

                                        Id = "Bearer"
                                    }
                            },

                            Array.Empty<string>()
                        }
                    }
                );
            });


            // =========================================
            // Build
            // =========================================

            var app = builder.Build();


            // =========================================
            // Swagger
            // =========================================

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();

                app.UseSwaggerUI();
            }


            // =========================================
            // Middleware
            // =========================================

            app.UseCors("AllowAngular");

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();


            // =========================================
            // Run
            // =========================================

            app.Run();
        }
    }
}