using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using CourseManagementSystem.Repositories;

namespace CourseManagementSystem.Services
{
    public class EnrollmentService
    {
        private readonly EnrollmentRepository _repository;

        public EnrollmentService(EnrollmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Enrollment>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Enrollment?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<List<Enrollment>> GetByStudentId(int studentId)
        {
            return await _repository.GetByStudentId(studentId);
        }

        public async Task<List<Enrollment>> GetByCourseId(int courseId)
        {
            return await _repository.GetByCourseId(courseId);
        }

        public async Task<Enrollment> Add(EnrollmentDto dto)
        {
            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                Status = dto.Status,
                Grade = dto.Grade,
                EnrollmentDate = DateTime.Now
            };

            return await _repository.Add(enrollment);
        }

        public async Task<bool> Update(int id, EnrollmentDto dto)
        {
            var enrollment = new Enrollment
            {
                Id = id,
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                Status = dto.Status,
                Grade = dto.Grade
            };

            return await _repository.Update(enrollment);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}