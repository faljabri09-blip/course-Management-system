using System.ComponentModel.DataAnnotations;

namespace Course_system.DTOs
{
    public class CourseInputDto
    {
        
            [Required(ErrorMessage = "Value should not be null.")]
            public string CourseName { get; set; }

            [Required]
            public string Description { get; set; }

            [Required]
            [Range(1, int.MaxValue, ErrorMessage = "Value must be greater than 0.")]
            public int Price { get; set; }
        
    }
}
