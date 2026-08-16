using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}