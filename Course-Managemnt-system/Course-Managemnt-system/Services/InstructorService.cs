using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using CourseManagementSystem.Repositories;

namespace CourseManagementSystem.Services
{
    public class InstructorService
    {
        private readonly InstructorRepository _repository;

        public InstructorService(InstructorRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<InstructorDto>> GetAll()
        {
            var instructors = await _repository.GetAll();

            return instructors.Select(i => new InstructorDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Phone = i.Phone,
                Specialization = i.Specialization
            }).ToList();
        }

        public async Task<InstructorDto?> GetById(int id)
        {
            var instructor = await _repository.GetById(id);

            if (instructor == null)
                return null;

            return new InstructorDto
            {
                Id = instructor.Id,
                Name = instructor.Name,
                Email = instructor.Email,
                Phone = instructor.Phone,
                Specialization = instructor.Specialization
            };
        }

        public async Task<Instructor> Add(InstructorDto dto)
        {
            var instructor = new Instructor
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Specialization = dto.Specialization
            };

            return await _repository.Add(instructor);
        }

        public async Task<bool> Update(int id, InstructorDto dto)
        {
            var instructor = new Instructor
            {
                Id = id,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Specialization = dto.Specialization
            };

            return await _repository.Update(instructor);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}