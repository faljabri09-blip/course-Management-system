using Course_system.Models;
using Course_system.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly EnrollmentService _service;

    public EnrollmentController(EnrollmentService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetEnrollmentById(int id)
    {
        var enrollment = _service.GetEnrollmentById(id);

        if (enrollment == null)
            return NotFound();

        return Ok(enrollment);
    }

    [HttpPost]
    public IActionResult Register(EnrollmentOutPutDto dto)
    {
        var enrollment = new Enrollment
        {
            StudentId = dto.StudentId,
            CourseId = dto.CourseId,
            EnrollmentDate = dto.EnrollmentDate
        };

        _service.RegisterStudent(enrollment);

        return Ok("Student Registered Successfully");
    }


    [HttpGet("Student/{studentId}")]
    public IActionResult GetStudentCourses(int studentId)
    {
        return Ok(_service.GetStudentCourses(studentId));
    }

    [HttpGet("Course/{courseId}")]
    public IActionResult GetCourseStudents(int courseId)
    {
        return Ok(_service.GetCourseStudents(courseId));
    }

    [HttpDelete("Enrollement/{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Enrollment Deleted Successfully");
    }
}