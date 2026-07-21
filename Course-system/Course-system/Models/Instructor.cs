using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Course_system.Models
{
    public class Instructor
    {
     
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int InstructorId { get; set; }

            [Required]
            [MaxLength(100)]
            public string FullName { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Specialization { get; set; }


            //relationship
            //one to many
            public ICollection<Course> Courses { get; set; }
        
    }
}
