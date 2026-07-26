using System.ComponentModel.DataAnnotations;

namespace Course_system.DTOs
{
    public class CreateInstructorDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string Specialization { get; set; }
    }
}