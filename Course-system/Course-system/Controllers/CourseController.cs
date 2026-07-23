using Course_system.Models;
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
    public IActionResult Add(Course course)
    {
        _service.Add(course);

        return Ok("Course added successfully.");
    }

    [HttpPut]
    public IActionResult Update(Course course)
    {
        _service.Update(course);

        return Ok("Course updated successfully.");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Course deleted successfully.");
    }
}