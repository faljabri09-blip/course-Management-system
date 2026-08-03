using System.ComponentModel.DataAnnotations;

namespace Course_system.DTOs
{
    public class EnrollmentOutPutDto
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int CourseId { get; set; }

        public DateTime EnrollmentDate { get; set; } = DateTime.Now;
    }
}