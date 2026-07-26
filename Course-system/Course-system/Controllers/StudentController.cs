using Course_system.Models;
using Course_system.DTOs;
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
    public IActionResult Add(CreateStudentDto dto)
    {
        var student = new Student
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber
        };

        _service.Add(student);

        return Ok("Student Added Successfully");
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, CreateStudentDto dto)
    {
        var student = _service.GetById(id);

        if (student == null)
            return NotFound();

        student.FullName = dto.FullName;
        student.Email = dto.Email;
        student.PhoneNumber = dto.PhoneNumber;

        _service.Update(student);

        return Ok("Student Updated Successfully");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Student Deleted Successfully");
    }
}