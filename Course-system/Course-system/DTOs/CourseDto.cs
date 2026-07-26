namespace Course_system.DTOs
{
    public class CourseDto
    {
        public int CourseId { get; set; }

        public string CourseName { get; set; }

        public string Description { get; set; }

        public int Duration { get; set; }

        public decimal Price { get; set; }

        public int InstructorId { get; set; }

        public string InstructorName { get; set; }
    }
}