using Course_system;
using Course_system.Models;
using Microsoft.EntityFrameworkCore;


public class InstructorRepository
{

    private readonly CourseContext context;

    public InstructorRepository(CourseContext _context)
    {
        context = _context;
    }

    public List<Instructor> GetAll()
    {

        return context.Instructors
            .Include(i => i.Courses)
            .ToList();
    }

    public Instructor GetById(int id)
    {
        return context.Instructors
            .Include(i => i.Courses)
            .FirstOrDefault(i => i.InstructorId == id);
    }

    public void Add(Instructor instructor)
    {
        context.Instructors.Add(instructor);
        context.SaveChanges();
    }

    public void Update(Instructor instructor)
    {
        context.Instructors.Update(instructor);
        context.SaveChanges();
    }

    public void Delete(Instructor instructor)
    {
        context.Instructors.Remove(instructor);
        context.SaveChanges();
    }
}