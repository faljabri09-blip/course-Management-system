using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly CourseService _service;

        public CourseController(CourseService service)
        {
            _service = service;
        }


        // ==========================================
        // GET ALL COURSES
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(
                await _service.GetAll()
            );
        }


        // ==========================================
        // GET COURSES BY INSTRUCTOR
        // ==========================================

        [HttpGet("instructor/{instructorId}")]
        public async Task<IActionResult> GetByInstructor(
            int instructorId)
        {
            return Ok(
                await _service.GetByInstructorId(
                    instructorId
                )
            );
        }


        // ==========================================
        // GET COURSE BY ID
        // ==========================================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var course = await _service.GetById(id);

            if (course == null)
                return NotFound();

            return Ok(course);
        }


        // ==========================================
        // ADD COURSE
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add(
            CourseDto dto)
        {
            var course = await _service.Add(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = course.Id },
                course
            );
        }


        // ==========================================
        // UPDATE COURSE
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            CourseDto dto)
        {
            var result =
                await _service.Update(id, dto);

            if (!result)
                return NotFound();

            return Ok(
                "Course updated successfully"
            );
        }


        // ==========================================
        // DELETE COURSE
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            var result =
                await _service.Delete(id);

            if (!result)
                return NotFound();

            return Ok(
                "Course deleted successfully"
            );
        }
    }
}