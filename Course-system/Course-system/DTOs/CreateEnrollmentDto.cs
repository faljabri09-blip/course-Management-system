using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs
{
    public class CreateEnrollmentDto
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int CourseId { get; set; }

        public DateTime EnrollmentDate { get; set; } = DateTime.Now;
    }
}