using Course_system.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly StudentService _service;

    public StudentController(StudentService service)
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
        var student = _service.GetById(id);

        if (student == null)
            return NotFound();

        return Ok(student);
    }

    [HttpPost]
    public IActionResult Add(Student student)
    {
        _service.Add(student);

        return Ok("Student added successfully.");
    }

    [HttpPut]
    public IActionResult Update(Student student)
    {
        _service.Update(student);

        return Ok("Student updated successfully.");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Student deleted successfully.");
    }
}