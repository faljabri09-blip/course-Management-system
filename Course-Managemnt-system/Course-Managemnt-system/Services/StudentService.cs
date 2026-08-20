using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using CourseManagementSystem.Repositories;

namespace CourseManagementSystem.Services
{
    public class StudentService
    {
        private readonly StudentRepository _repository;

        public StudentService(StudentRepository repository)
        {
            _repository = repository;
        }

        // =========================================
        // Get All Students
        // =========================================

        public async Task<List<Student>> GetAll()
        {
            return await _repository.GetAll();
        }

        // =========================================
        // Get Student By ID
        // =========================================

        public async Task<Student?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        // =========================================
        // Add Student
        // =========================================

        public async Task<Student> Add(StudentDTo dto)
        {
            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone
            };

            return await _repository.Add(student);
        }

        // =========================================
        // Update Student
        // =========================================

        public async Task<bool> Update(int id, StudentDTo dto)
        {
            var student = new Student
            {
                Id = id,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone
            };

            return await _repository.Update(student);
        }

        // =========================================
        // Delete Student
        // =========================================

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}