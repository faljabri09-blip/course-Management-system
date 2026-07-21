using Course_system.Models;
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

    //[HttpPost]
    //public IActionResult Add(Instructor instructor)
    //{
    //    _service.Add(instructor);

    //    return Ok("Instructor added successfully.");
    //}

    [HttpPut]
    public IActionResult Update(Instructor instructor)
    {
        _service.Update(instructor);

        return Ok("Instructor updated successfully.");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);

        return Ok("Instructor deleted successfully.");
    }

    [HttpPost]
    public IActionResult Add([FromBody] Instructor instructor)
    {
        if (instructor == null)
        {
            return BadRequest("Instructor data is required.");
        }

        _service.Add(instructor);

        return Ok(new
        {
            Message = "Instructor added successfully.",
            Data = instructor
        });
    }
}