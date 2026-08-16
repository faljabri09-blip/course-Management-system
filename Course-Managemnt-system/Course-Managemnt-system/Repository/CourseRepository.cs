using CourseManagementSystem.Data;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Repositories
{
    public class CourseRepository
    {
        private readonly CourseContext _context;

        public CourseRepository(CourseContext context)
        {
            _context = context;
        }

        public async Task<List<Course>> GetAll()
        {
            return await _context.Courses
                .Include(c => c.Instructor)
                .ToListAsync();
        }

        public async Task<Course?> GetById(int id)
        {
            return await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Course> Add(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return course;
        }

        public async Task<bool> Update(Course course)
        {
            var existing = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == course.Id);

            if (existing == null)
                return false;

            existing.Title = course.Title;
            existing.Description = course.Description;
            existing.Credits = course.Credits;
            existing.Price = course.Price;
            existing.InstructorId = course.InstructorId;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
                return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}