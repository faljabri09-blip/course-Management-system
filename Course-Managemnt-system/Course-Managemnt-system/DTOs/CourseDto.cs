using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Credits { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public int InstructorId { get; set; }
    }
}