using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Course_Managment_System.Models
{
    public class Instructor
    {
        public int InstructorId { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Specialization { get; set; }


        public ICollection<Course> Courses { get; set; }
    }
}
