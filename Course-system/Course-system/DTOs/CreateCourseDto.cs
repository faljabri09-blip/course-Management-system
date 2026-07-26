using System.ComponentModel.DataAnnotations;

namespace Course_system.DTOs
{
    public class CreateCourseDto
    {
        [Required]
        [MaxLength(150)]
        public string CourseName { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [Range(1, 500)]
        public int Duration { get; set; }

        [Range(0, 10000)]
        public decimal Price { get; set; }

        [Required]
        public int InstructorId { get; set; }
    }
}