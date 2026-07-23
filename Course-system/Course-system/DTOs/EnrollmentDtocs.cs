namespace CourseManagementSystem.DTOs
{
    public class EnrollmentDto
    {
        public int EnrollmentId { get; set; }

        public string StudentName { get; set; }

        public string CourseName { get; set; }

        public DateTime EnrollmentDate { get; set; }
    }
}