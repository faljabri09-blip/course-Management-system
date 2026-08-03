using System.ComponentModel.DataAnnotations;

namespace Course_system.DTOs
{
    public class CourseOutPutDto
    {
        [Required]
        [MaxLength(150)]
        public string CourseName { get; set; }


        [Range(0, 10000)]
        public decimal Price { get; set; }

      
    }
}