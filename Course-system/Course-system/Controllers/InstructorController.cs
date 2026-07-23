using Course_system.Models;
using CourseManagementSystem.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class InstructorController : ControllerBase
{
    private readonly InstructorService _service;

    public InstructorController(InstructorService service)
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
        var instructor = _service.GetById(id);

        if (instructor == null)
            return NotFound();

        return Ok(instructor);
    }

    [HttpPost]
    public IActionResult Add(CreateInstructorDto dto)
    {
        var instructor = new Instructor
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Specialization = dto.Specialization
        };

        _service.Add(instructor);

        return Ok("Instructor Added Successfully");
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, CreateInstructorDto dto)
    {
        var instructor = _service.GetById(id);

        if (instructor == null)
            return NotFound();

        instructor.FullName = dto.FullName;
        instructor.Email = dto.Email;
        instructor.Specialization = dto.Specialization;

        _service.Update(instructor);

        return Ok("Instructor Updated Successfully");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Instructor Deleted Successfully");
    }
}