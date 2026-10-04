using System.Security.Claims;
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
        private readonly InstructorService _instructorService;

        public StudentController(
            StudentService service,
            InstructorService instructorService)
        {
            _service = service;
            _instructorService = instructorService;
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
                return NotFound();

            return Ok(student);
        }


        // =========================================
        // Add Student
        // =========================================

        [Authorize(Roles = "Admin,Instructor")]
        [HttpPost]
        public async Task<IActionResult> Add(StudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            // =========================================
            // Admin
            // =========================================

            if (User.IsInRole("Admin"))
            {
                var student = await _service.Add(
                    dto,
                    null
                );

                return Ok(student);
            }


            // =========================================
            // Instructor
            // =========================================

            var username =
                User.FindFirstValue(
                    ClaimTypes.Name
                );

            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized(
                    "Instructor identity was not found."
                );
            }


            // =========================================
            // Find Instructor
            // =========================================

            var instructor =
                await _instructorService
                    .GetByUsernameOrEmail(username);

            if (instructor == null)
            {
                return BadRequest(
                    "Instructor information was not found."
                );
            }


            // =========================================
            // Add Student With InstructorId
            // =========================================

            var result =
                await _service.Add(
                    dto,
                    instructor.Id
                );


            return Ok(result);
        }


        // =========================================
        // Update Student
        // =========================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            StudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result =
                await _service.Update(id, dto);

            if (!result)
                return NotFound();

            return Ok(
                "Student updated successfully"
            );
        }


        // =========================================
        // Delete Student
        // =========================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result =
                await _service.Delete(id);

            if (!result)
                return NotFound();

            return Ok(
                "Student deleted successfully"
            );
        }
    }
}