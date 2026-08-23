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

        // =========================================
        // Get All Instructors
        // =========================================

        public async Task<List<InstructorDto>> GetAll()
        {
            var instructors = await _repository.GetAll();

            return instructors.Select(i => new InstructorDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Phone = i.Phone,
                Specialization = i.Specialization,

                // Courses taught by instructor
                Courses = i.Courses
                    .Select(c => c.Title)
                    .ToList()

            }).ToList();
        }


        // =========================================
        // Get Instructor By ID
        // =========================================

        public async Task<InstructorDto?> GetById(int id)
        {
            var instructor = await _repository.GetById(id);

            if (instructor == null)
            {
                return null;
            }

            return new InstructorDto
            {
                Id = instructor.Id,
                Name = instructor.Name,
                Email = instructor.Email,
                Phone = instructor.Phone,
                Specialization = instructor.Specialization,

                // Courses taught by instructor
                Courses = instructor.Courses
                    .Select(c => c.Title)
                    .ToList()
            };
        }


        // =========================================
        // Add Instructor
        // =========================================

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


        // =========================================
        // Update Instructor
        // =========================================

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


        // =========================================
        // Delete Instructor
        // =========================================

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}