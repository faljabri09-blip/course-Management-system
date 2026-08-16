using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using CourseManagementSystem.Repositories;

namespace CourseManagementSystem.Services
{
    public class CourseService
    {
        private readonly CourseRepository _repository;

        public CourseService(CourseRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Course>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Course?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Course> Add(CourseDto dto)
        {
            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                Credits = dto.Credits,
                Price = dto.Price,
                InstructorId = dto.InstructorId
            };

            return await _repository.Add(course);
        }

        public async Task<bool> Update(int id, CourseDto dto)
        {
            var course = new Course
            {
                Id = id,
                Title = dto.Title,
                Description = dto.Description,
                Credits = dto.Credits,
                Price = dto.Price,
                InstructorId = dto.InstructorId
            };

            return await _repository.Update(course);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}