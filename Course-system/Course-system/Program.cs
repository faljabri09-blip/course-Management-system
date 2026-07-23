using Course_Managment_System;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace Course_system
{
    public class Program
    {


        public static void Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);

            // Add Instructor services
            builder.Services.AddControllers();
            builder.Services.AddDbContext<CourseContext>();
            builder.Services.AddScoped<InstructorRepository>();
            builder.Services.AddScoped<InstructorService>();
            builder.Services.AddScoped<InstructorController>();


            // Course services 

            builder.Services.AddScoped<CourseRepository>();
            builder.Services.AddScoped<CourseService>();

            // Student services

            builder.Services.AddScoped<StudentRepository>();
            builder.Services.AddScoped<StudentService>();

            // Enrollement services 

            builder.Services.AddScoped<EnrollmentRepository>();
            builder.Services.AddScoped<EnrollmentService>();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
