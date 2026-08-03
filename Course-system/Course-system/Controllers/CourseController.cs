using Course_system.Models;
using Course_system.DTOs;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
//[Route("api/[controller]")]
[Route("Course")]
[Authorize]
public class CourseController : ControllerBase
{
    private CourseService _service;

    public CourseController(CourseService service)
    {
        _service = service;
    }

    [AllowAnonymous]
    [HttpGet("GetAll")]
    public IActionResult GetAll()
    {
        List<CourseOutPutDto> result = _service.GetAll();

        if (result.Count > 0)
        {
            return Ok(result);
        }

        return NoContent();
    }

    [HttpGet("GetCourseById/{id}")]
    public IActionResult GetCourseById([FromRoute] int id)
    {
        CourseAllOutPutDto course = _service.GetCourseById(id);

        if (course == null)
        {
            return NotFound(); // 404 notfound
        }

        return Ok(course);
    }

    

    [HttpPost]
    public IActionResult Add(CourseOutPutDto dto)
    {
        var course = new Course
        {
            CourseName = dto.CourseName,
            Price = dto.Price,
        };

        _service.Add(course);

        return Ok("Course Added Successfully");
    }

    

    [HttpPost("AddDTO")]
    public IActionResult AddDTO([FromBody] CourseInputDto course)
    {
        int courseId = _service.Create(course);

        return Ok(new { courseId = courseId });
        return Ok("Course added successfully");

    }


    [Authorize(Roles = "Admin")]
    [HttpPut("UpdatePrice/{courseId}")]
    public IActionResult UpdatePrice([FromRoute] int courseId, [FromQuery] int newPrice)
    {
        bool updated = _service.UpdatePrice(courseId, newPrice);

        if (!updated)
            return NotFound();

        return Ok("Updated successfully");
        // return NoContent();
    }

    

    [Authorize(Roles = "Admin")]
    [HttpDelete("Delete/{CourseId}")]
    public IActionResult Delete([FromRoute] int CourseId)
    {
        bool deleted = _service.Delete(CourseId);

        if (!deleted)
            return NotFound();

        return Ok("deleted successfully");
        //return NoContent();
    }
}