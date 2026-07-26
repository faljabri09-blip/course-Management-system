using Course_system.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Course_system
{
    public class CourseContext : DbContext
    {

        public CourseContext(DbContextOptions<CourseContext> options)
        : base(options)
        {
        }

        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(
                "Server=localhost;Database=CourseDB;Trusted_Connection=True;TrustServerCertificate=True;"
            );
        }
    

    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Password = "1234",
                    Role = "Admin"
                },

                new User
                {
                    Id = 2,
                    Username = "instructor",
                    Password = "1234",
                    Role = "Instructor"
                },

                new User
                {
                    Id = 3,
                    Username = "student",
                    Password = "1234",
                    Role = "Student"
                }
            );
        }
    }


    }
