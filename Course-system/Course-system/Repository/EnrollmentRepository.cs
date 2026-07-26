using Course_system;
using Course_system.Models;
using Microsoft.EntityFrameworkCore;
using System;

public class EnrollmentRepository
{
    private readonly CourseContext _context;

    public EnrollmentRepository(CourseContext context)
    {
        _context = context;
    }

    public List<Enrollment> GetAll()
    {
        return _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .ThenInclude(c => c.Instructor)
            .ToList();
    }

    public Enrollment GetById(int id)
    {
        return _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .ThenInclude(c => c.Instructor)
            .FirstOrDefault(e => e.EnrollmentId == id);
    }

    public void Add(Enrollment enrollment)
    {
        _context.Enrollments.Add(enrollment);
        _context.SaveChanges();
    }

    public void Delete(Enrollment enrollment)
    {
        _context.Enrollments.Remove(enrollment);
        _context.SaveChanges();
    }

    public List<Enrollment> GetByStudent(int studentId)
    {
        return _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .ToList();
    }

    public List<Enrollment> GetByCourse(int courseId)
    {
        return _context.Enrollments
            .Include(e => e.Student)
            .Where(e => e.CourseId == courseId)
            .ToList();
    }
}