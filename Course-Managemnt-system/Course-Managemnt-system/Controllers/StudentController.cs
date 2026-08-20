using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _service;

        public StudentController(StudentService service)
        {
            _service = service;
        }

        // =========================================
        // Get All Students
        // =========================================

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _service.GetAll();

            return Ok(students);
        }

        // =========================================
        // Get Student By ID
        // =========================================

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _service.GetById(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        // =========================================
        // Add Student
        // =========================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add(StudentDTo dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = await _service.Add(dto);

            return Ok(student);
        }

        // =========================================
        // Update Student
        // =========================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            StudentDTo dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.Update(id, dto);

            if (!result)
            {
                return NotFound();
            }

            return Ok("Student updated successfully");
        }

        // =========================================
        // Delete Student
        // =========================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.Delete(id);

            if (!result)
            {
                return NotFound();
            }

            return Ok("Student deleted successfully");
        }
    }
}