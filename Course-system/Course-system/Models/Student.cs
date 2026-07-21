using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Course_system.Models
{
        [Table("Student")]
        public class Student
        {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int StudentId { get; set; }

            [Required]
            [MaxLength(100)]
            public string FullName { get; set; }

            [Required]
            [MaxLength(100)]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [MaxLength(50)]
            public string PhoneNumber { get; set; }

            //Relationship

            //one to many
            public ICollection<Enrollment> Enrollments { get; set; }

        }
    }


