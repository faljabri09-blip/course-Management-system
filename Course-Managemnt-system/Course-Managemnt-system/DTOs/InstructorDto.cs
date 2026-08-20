using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs
{
    public class InstructorDto
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Specialization { get; set; } = string.Empty;
    }
}