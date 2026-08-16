namespace CourseManagementSystem.DTOs
{
    public class CourseDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int Credits { get; set; }

        public decimal Price { get; set; }

        public int InstructorId { get; set; }
    }
}