using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController : ControllerBase
    {
        private readonly EnrollmentService _service;

        public EnrollmentController(EnrollmentService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var enrollment = await _service.GetById(id);

            if (enrollment == null)
                return NotFound();

            return Ok(enrollment);
        }

        [Authorize]
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            return Ok(await _service.GetByStudentId(studentId));
        }

        [Authorize]
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(int courseId)
        {
            return Ok(await _service.GetByCourseId(courseId));
        }

        [Authorize(Roles = "Admin,Student")]
        [HttpPost]
        public async Task<IActionResult> Add(EnrollmentDto dto)
        {
            var enrollment = await _service.Add(dto);

            return Ok(enrollment);
        }

        [Authorize(Roles = "Admin,Instructor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            EnrollmentDto dto)
        {
            var result = await _service.Update(id, dto);

            if (!result)
                return NotFound();

            return Ok("Enrollment updated successfully");
        }

        [Authorize(Roles = "Admin,Student")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.Delete(id);

            if (!result)
                return NotFound();

            return Ok("Enrollment deleted successfully");
        }
    }
}