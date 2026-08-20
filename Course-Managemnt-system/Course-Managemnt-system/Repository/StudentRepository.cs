using CourseManagementSystem.Data;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Repositories
{
    public class StudentRepository
    {
        private readonly CourseContext _context;

        public StudentRepository(CourseContext context)
        {
            _context = context;
        }

        // =========================================
        // Get All Students
        // =========================================

        public async Task<List<Student>> GetAll()
        {
            return await _context.Students
                .Include(s => s.Enrollments)
                .ThenInclude(e => e.Course)
                .ToListAsync();
        }

        // =========================================
        // Get Student By ID
        // =========================================

        public async Task<Student?> GetById(int id)
        {
            return await _context.Students
                .Include(s => s.Enrollments)
                .ThenInclude(e => e.Course)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        // =========================================
        // Add Student
        // =========================================

        public async Task<Student> Add(Student student)
        {
            _context.Students.Add(student);

            await _context.SaveChangesAsync();

            return student;
        }

        // =========================================
        // Update Student
        // =========================================

        public async Task<bool> Update(Student student)
        {
            var existing = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == student.Id);

            if (existing == null)
            {
                return false;
            }

            existing.Name = student.Name;
            existing.Email = student.Email;
            existing.Phone = student.Phone;

            await _context.SaveChangesAsync();

            return true;
        }

        // =========================================
        // Delete Student
        // =========================================

        public async Task<bool> Delete(int id)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return false;
            }

            _context.Students.Remove(student);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}