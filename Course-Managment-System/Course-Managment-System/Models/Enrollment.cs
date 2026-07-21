using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Course_Managment_System.Models
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }

        public DateTime EnrollmentDate { get; set; }


        public int StudentId { get; set; }

        public Student Student { get; set; }


        public int CourseId { get; set; }

        public Course Course { get; set; }
    }
}
