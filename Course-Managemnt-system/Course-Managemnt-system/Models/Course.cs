using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int Credits { get; set; }

        public decimal Price { get; set; }

        public int InstructorId { get; set; }

        public Instructor? Instructor { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; }
            = new List<Enrollment>();
    }
}