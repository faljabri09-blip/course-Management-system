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


        public EnrollmentController(
            EnrollmentService service)
        {
            _service = service;
        }


        // =========================================
        // Get All Enrollments
        // =========================================

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var enrollments =
                await _service.GetAll();

            return Ok(enrollments);
        }


        // =========================================
        // Get Enrollment By ID
        // =========================================

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(
            int id)
        {
            var enrollment =
                await _service.GetById(id);


            if (enrollment == null)
            {
                return NotFound();
            }


            return Ok(enrollment);
        }


        // =========================================
        // Get Enrollments By Student
        // =========================================

        [Authorize]
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetByStudent(
            int studentId)
        {
            var enrollments =
                await _service.GetByStudentId(
                    studentId
                );


            return Ok(enrollments);
        }


        // =========================================
        // Get Enrollments By Course
        // =========================================

        [Authorize]
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(
            int courseId)
        {
            var enrollments =
                await _service.GetByCourseId(
                    courseId
                );


            return Ok(enrollments);
        }


        // =========================================
        // Add Enrollment
        //
        // Admin
        // Instructor
        // Student
        // =========================================

        [Authorize(
            Roles = "Admin,Instructor,Student"
        )]
        [HttpPost]
        public async Task<IActionResult> Add(
            EnrollmentDto dto)
        {
            // -------------------------------------
            // Validate Model
            // -------------------------------------

            if (!ModelState.IsValid)
            {
                return BadRequest(
                    ModelState
                );
            }


            // -------------------------------------
            // Add Enrollment
            // -------------------------------------

            var enrollment =
                await _service.Add(dto);


            // -------------------------------------
            // Already Exists
            // -------------------------------------

            if (enrollment == null)
            {
                return BadRequest(
                    "This student is already enrolled in this course."
                );
            }


            // -------------------------------------
            // Success
            // -------------------------------------

            return Ok(enrollment);
        }


        // =========================================
        // Update Enrollment
        //
        // Admin + Instructor
        // =========================================

        [Authorize(
            Roles = "Admin,Instructor"
        )]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            EnrollmentDto dto)
        {
            // -------------------------------------
            // Validate Model
            // -------------------------------------

            if (!ModelState.IsValid)
            {
                return BadRequest(
                    ModelState
                );
            }


            // -------------------------------------
            // Update
            // -------------------------------------

            var result =
                await _service.Update(
                    id,
                    dto
                );


            if (!result)
            {
                return NotFound();
            }


            return Ok(
                "Enrollment updated successfully"
            );
        }


        // =========================================
        // Delete Enrollment
        //
        // Admin + Student
        // =========================================

        [Authorize(
            Roles = "Admin,Student"
        )]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            var result =
                await _service.Delete(id);


            if (!result)
            {
                return NotFound();
            }


            return Ok(
                "Enrollment deleted successfully"
            );
        }
    }
}