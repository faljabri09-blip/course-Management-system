using Course_system.Models;


public class StudentService 
{
    private StudentRepository _repository;

    public StudentService(StudentRepository repository)
    {
        _repository = repository;
    }

    public List<Student> GetAll()
    {
        return _repository.GetAll();
    }

    public Student GetById(int id)
    {
        return _repository.GetById(id);
    }

    public void Add(Student student)
    {
        _repository.Add(student);
    }

    public void Update(Student student)
    {
        _repository.Update(student);
    }

    public void Delete(int id)
    {
        var student = _repository.GetById(id);

        if (student != null)
        {
            _repository.Delete(student);
        }
    }
}