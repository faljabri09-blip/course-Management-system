using CourseManagementSystem.Data;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Repositories
{
    public class EnrollmentRepository
    {
        private readonly CourseContext _context;

        public EnrollmentRepository(CourseContext context)
        {
            _context = context;
        }

        public async Task<List<Enrollment>> GetAll()
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .ThenInclude(c => c!.Instructor)
                .ToListAsync();
        }

        public async Task<Enrollment?> GetById(int id)
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Enrollment>> GetByStudentId(int studentId)
        {
            return await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<List<Enrollment>> GetByCourseId(int courseId)
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                .Where(e => e.CourseId == courseId)
                .ToListAsync();
        }

        public async Task<Enrollment> Add(Enrollment enrollment)
        {
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return enrollment;
        }

        public async Task<bool> Update(Enrollment enrollment)
        {
            var existing = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.Id == enrollment.Id);

            if (existing == null)
                return false;

            existing.Status = enrollment.Status;
            existing.Grade = enrollment.Grade;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.Id == id);

            if (enrollment == null)
                return false;

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}