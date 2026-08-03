using Course_system.DTOs;
using Course_system.Models;

public class EnrollmentService 
{
    private readonly EnrollmentRepository _repository;

    public EnrollmentService(EnrollmentRepository repository)
    {
        _repository = repository;
    }

   

    public List<EnrollmentOutPutDto> GetAll()
    {
        return _repository.GetAll()
            .Select(Enrollment => new EnrollmentOutPutDto
            {
                StudentId = Enrollment.StudentId,
                CourseId = Enrollment.CourseId,
                EnrollmentDate = Enrollment.EnrollmentDate,
            })
                       .ToList();
    }

 

    public EnrollmentOutPutDto GetEnrollmentById(int id)
    {
        Enrollment e = _repository.GetEnrollmentById(id);

        EnrollmentOutPutDto output = new EnrollmentOutPutDto();
        output.StudentId = e.StudentId;
        output.CourseId = e.CourseId;
        output.EnrollmentDate = e.EnrollmentDate;

        return output;
    }

    public void RegisterStudent(Enrollment enrollment)
    {
        _repository.Add(enrollment);
    }

    public void Delete(int id)
    {
        var enrollment = _repository.GetEnrollmentById(id);

        if (enrollment != null)
        {
            _repository.Delete(enrollment);
        }
    }


    public List<Enrollment> GetStudentCourses(int studentId)
    {
        return _repository.GetByStudent(studentId);
    }

    public List<Enrollment> GetCourseStudents(int courseId)
    {
        return _repository.GetByCourse(courseId);
    }
}