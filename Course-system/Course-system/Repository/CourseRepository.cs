using Course_system;
using Course_system.Models;
using Microsoft.EntityFrameworkCore;

public class CourseRepository 
{
    private readonly CourseContext _context;

    public CourseRepository(CourseContext context)
    {
        _context = context;
    }

    public List<Course> GetAll()
    {
        return _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Enrollments)
            .ToList();
    }

    public Course GetById(int id)
    {
        return _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Enrollments)
            .FirstOrDefault(c => c.CourseId == id);
    }

    public void Add(Course course)
    {
        _context.Courses.Add(course);
        _context.SaveChanges();
    }

    public void Update(Course course)
    {
        _context.Courses.Update(course);
        _context.SaveChanges();
    }

    public void Delete(Course course)
    {
        _context.Courses.Remove(course);
        _context.SaveChanges();
    }

    public List<Course> GetByInstructor(int instructorId)
    {
        return _context.Courses
            .Where(c => c.InstructorId == instructorId)
            .ToList();
    }
}