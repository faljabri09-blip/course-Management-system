using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs
{
    public class CreateStudentDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }
    }
}