using Course_system.Models;
using Course_system.DTOs;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly CourseService _service;

    public CourseController(CourseService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var course = _service.GetById(id);

        if (course == null)
            return NotFound();

        return Ok(course);
    }

    [HttpGet("Instructor/{instructorId}")]
    public IActionResult GetByInstructor(int instructorId)
    {
        return Ok(_service.GetByInstructor(instructorId));
    }

    [HttpPost]
    public IActionResult Add(CreateCourseDto dto)
    {
        var course = new Course
        {
            CourseName = dto.CourseName,
            Description = dto.Description,
            Duration = dto.Duration,
            Price = dto.Price,
            InstructorId = dto.InstructorId
        };

        _service.Add(course);

        return Ok("Course Added Successfully");
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, CreateCourseDto dto)
    {
        var course = _service.GetById(id);

        if (course == null)
            return NotFound();

        course.CourseName = dto.CourseName;
        course.Description = dto.Description;
        course.Duration = dto.Duration;
        course.Price = dto.Price;
        course.InstructorId = dto.InstructorId;

        _service.Update(course);

        return Ok("Course Updated Successfully");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Course Deleted Successfully");
    }
}