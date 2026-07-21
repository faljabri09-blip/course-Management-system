using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Course_Managment_System.Models
{
    public class Course
    {
        public int CourseId { get; set; }

        public string CourseName { get; set; }

        public string Description { get; set; }

        public int Duration { get; set; }

        public decimal Price { get; set; }


        public int InstructorId { get; set; }

        public Instructor Instructor { get; set; }


        public ICollection<Enrollment> Enrollments { get; set; }
    }
}
