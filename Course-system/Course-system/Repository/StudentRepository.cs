using Course_Managment_System;
using Course_system.Models;
using Microsoft.EntityFrameworkCore;
using System;

public class StudentRepository 
{
    private readonly CourseContext _context;

    public StudentRepository(CourseContext context)
    {
        _context = context;
    }

    public List<Student> GetAll()
    {
        return _context.Students
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Course)
            .ToList();
    }

    public Student GetById(int id)
    {
        return _context.Students
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Course)
            .FirstOrDefault(s => s.StudentId == id);
    }

    public void Add(Student student)
    {
        _context.Students.Add(student);
        _context.SaveChanges();
    }

    public void Update(Student student)
    {
        _context.Students.Update(student);
        _context.SaveChanges();
    }

    public void Delete(Student student)
    {
        _context.Students.Remove(student);
        _context.SaveChanges();
    }
}