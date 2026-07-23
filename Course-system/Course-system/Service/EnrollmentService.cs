using Course_system.Models;

public class EnrollmentService 
{
    private readonly EnrollmentRepository _repository;

    public EnrollmentService(EnrollmentRepository repository)
    {
        _repository = repository;
    }

    public List<Enrollment> GetAll()
    {
        return _repository.GetAll();
    }

    public Enrollment GetById(int id)
    {
        return _repository.GetById(id);
    }

    public void RegisterStudent(Enrollment enrollment)
    {
        _repository.Add(enrollment);
    }

    public void Delete(int id)
    {
        var enrollment = _repository.GetById(id);

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