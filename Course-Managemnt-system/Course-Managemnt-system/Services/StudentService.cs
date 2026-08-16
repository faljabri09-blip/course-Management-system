using CourseManagementSystem.Data;
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

        public async Task<List<Student>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Student?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Student> Add(Student student)
        {
            return await _repository.Add(student);
        }

        public async Task<bool> Update(int id, Student student)
        {
            student.Id = id;

            return await _repository.Update(student);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}