using CourseManagementSystem.Data;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Repositories
{
    public class InstructorRepository
    {
        private readonly CourseContext _context;

        public InstructorRepository(CourseContext context)
        {
            _context = context;
        }

        public async Task<List<Instructor>> GetAll()
        {
            return await _context.Instructors
                .Include(i => i.Courses)
                .ToListAsync();
        }

        public async Task<Instructor?> GetById(int id)
        {
            return await _context.Instructors
                .Include(i => i.Courses)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Instructor> Add(Instructor instructor)
        {
            _context.Instructors.Add(instructor);

            await _context.SaveChangesAsync();

            return instructor;
        }

        public async Task<bool> Update(Instructor instructor)
        {
            var existing = await _context.Instructors
                .FirstOrDefaultAsync(i => i.Id == instructor.Id);

            if (existing == null)
                return false;

            existing.Name = instructor.Name;
            existing.Email = instructor.Email;
            existing.Phone = instructor.Phone;
            existing.Specialization = instructor.Specialization;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
                return false;

            _context.Instructors.Remove(instructor);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}