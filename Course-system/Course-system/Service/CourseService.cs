using Course_system.DTOs;
using Course_system.Models;
using Microsoft.AspNetCore.Cors.Infrastructure;

public class CourseService 
{
    private CourseRepository _repository;
    

    public CourseService(CourseRepository repository)
    {
        _repository = repository;
    }

    public List<CourseOutPutDto> GetAll()
    {
        return _repository.GetAll()
            .Select(Course => new CourseOutPutDto
            {
                CourseName = Course.CourseName,
                Price = Course.Price
            })
                       .ToList();
    }

    public CourseAllOutPutDto GetCourseById(int id)
    {
        Course c = _repository.GetCourseById(id);

        CourseAllOutPutDto output = new CourseAllOutPutDto();
        output.CourseName = c.CourseName;
        output.Description = c.Description;
        output.Price = c.Price;

        return output;
    }

    public int Create(Course Course)
    {

        _repository.Add(Course);
        return Course.CourseId;
    }


    public int Create(CourseInputDto Course)
    {

        Course c = new Course();
        c.CourseName = Course.CourseName;
        c.Price = Course.Price;
        c.Description = Course.Description;

        _repository.Add(c);
        return c.CourseId;
    }

    public void Add(Course course)
    {
        _repository.Add(course);
    }

    

    public bool UpdatePrice(int CourseId, int newPrice)
    {
        Course course = _repository.GetCourseById(CourseId);
        if (course == null)
        {
            return false;
        }

        course.Price = newPrice;
        _repository.UpdatePrice();
        return true;

    }

    public bool Delete(int CourseId)
    {
        Course course = _repository.GetCourseById(CourseId);
        if (course == null)
        {
            return false;
        }

        _repository.Delete(course);
        return true;
    }

}