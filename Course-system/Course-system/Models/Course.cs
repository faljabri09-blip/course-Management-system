using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Course_system.Models
{
    public class Course
    {
        [Table("Course")]
        public class Course
        {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int CourseId { get; set; }

            [Required]
            [StringLength(100)]
            public string CourseName { get; set; }

            [MaxLength(100)]
            public string Description { get; set; }

            [MaxLength(50)]
            [Range(1, 500)]
            public int Duration { get; set; }

            [Required]
            [Range(0, 10000)]
            public decimal Price { get; set; }

            [Required]
            public int InstructorId { get; set; }

            //Relatioship

            //one to one
            public Instructor Instructor { get; set; }

            //one to many
            public ICollection<Enrollment> Enrollments { get; set; }
        }
    }
}
