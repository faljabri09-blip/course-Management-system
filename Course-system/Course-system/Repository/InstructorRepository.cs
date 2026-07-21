using Course_Managment_System;
using Course_system.Models;
using Microsoft.EntityFrameworkCore;


public class InstructorRepository
{

    private readonly CourseContext _context;

    public InstructorRepository(CourseContext context)
    {
        _context = context;
    }

    public List<Instructor> GetAll()
    {

        return _context.Instructors
            .Include(i => i.Courses)
            .ToList();
    }

    public Instructor GetById(int id)
    {
        return _context.Instructors
            .Include(i => i.Courses)
            .FirstOrDefault(i => i.InstructorId == id);
    }

    public void Add(Instructor instructor)
    {
        _context.Instructors.Add(instructor);
        _context.SaveChanges();
    }

    public void Update(Instructor instructor)
    {
        _context.Instructors.Update(instructor);
        _context.SaveChanges();
    }

    public void Delete(Instructor instructor)
    {
        _context.Instructors.Remove(instructor);
        _context.SaveChanges();
    }
}