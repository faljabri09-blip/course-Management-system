namespace CourseManagementSystem.DTOs
{
    public class EnrollmentDto
    {
        public int StudentId { get; set; }

        public int CourseId { get; set; }

        public string Status { get; set; } = "Active";

        public decimal? Grade { get; set; }
    }
}