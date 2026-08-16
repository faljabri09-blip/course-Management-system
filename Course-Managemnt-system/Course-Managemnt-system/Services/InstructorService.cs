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

        public async Task<List<Instructor>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Instructor?> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Instructor> Add(Instructor instructor)
        {
            return await _repository.Add(instructor);
        }

        public async Task<bool> Update(int id, Instructor instructor)
        {
            instructor.Id = id;

            return await _repository.Update(instructor);
        }

        public async Task<bool> Delete(int id)
        {
            return await _repository.Delete(id);
        }
    }
}