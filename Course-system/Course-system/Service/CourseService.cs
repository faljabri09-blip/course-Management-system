using Course_system.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;

public class CourseService 
{
    private readonly CourseRepository _repository;

    public CourseService(CourseRepository repository)
    {
        _repository = repository;
    }

    public List<Course> GetAll()
    {
        return _repository.GetAll();
    }

    public Course GetById(int id)
    {
        return _repository.GetById(id);
    }

    public void Add(Course course)
    {
        _repository.Add(course);
    }

    public void Update(Course course)
    {
        _repository.Update(course);
    }

    public void Delete(int id)
    {
        var course = _repository.GetById(id);

        if (course != null)
        {
            _repository.Delete(course);
        }
    }

    public List<Course> GetByInstructor(int instructorId)
    {
        return _repository.GetByInstructor(instructorId);
    }
}