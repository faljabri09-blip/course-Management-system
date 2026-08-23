using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using CourseManagementSystem.Repositories;

namespace CourseManagementSystem.Services
{
    public class EnrollmentService
    {
        private readonly EnrollmentRepository _repository;

        public EnrollmentService(
            EnrollmentRepository repository)
        {
            _repository = repository;
        }


        // =========================================
        // Get All
        // =========================================

        public async Task<List<Enrollment>> GetAll()
        {
            return await _repository.GetAll();
        }


        // =========================================
        // Get By ID
        // =========================================

        public async Task<Enrollment?> GetById(int id)
        {
            return await _repository.GetById(id);
        }


        // =========================================
        // Get By Student
        // =========================================

        public async Task<List<Enrollment>> GetByStudentId(
            int studentId)
        {
            return await _repository.GetByStudentId(
                studentId
            );
        }


        // =========================================
        // Get By Course
        // =========================================

        public async Task<List<Enrollment>> GetByCourseId(
            int courseId)
        {
            return await _repository.GetByCourseId(
                courseId
            );
        }


        // =========================================
        // Add Enrollment
        // =========================================

        public async Task<Enrollment?> Add(
            EnrollmentDto dto)
        {
            // -------------------------------------
            // Check Existing Enrollment
            // -------------------------------------

            var exists =
                await _repository.Exists(
                    dto.StudentId,
                    dto.CourseId
                );


            if (exists)
            {
                return null;
            }


            // -------------------------------------
            // Create Enrollment
            // -------------------------------------

            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,

                CourseId = dto.CourseId,

                Status = dto.Status,

                Grade = dto.Grade,

                EnrollmentDate = DateTime.Now
            };


            // -------------------------------------
            // Save
            // -------------------------------------

            return await _repository.Add(
                enrollment
            );
        }


        // =========================================
        // Update Enrollment
        // =========================================

        public async Task<bool> Update(
            int id,
            EnrollmentDto dto)
        {
            var enrollment = new Enrollment
            {
                Id = id,

                StudentId = dto.StudentId,

                CourseId = dto.CourseId,

                Status = dto.Status,

                Grade = dto.Grade
            };


            return await _repository.Update(
                enrollment
            );
        }


        // =========================================
        // Delete Enrollment
        // =========================================

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}