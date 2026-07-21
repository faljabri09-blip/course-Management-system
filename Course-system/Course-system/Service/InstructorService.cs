using Course_system.Models;


public class InstructorService
{
    private readonly InstructorRepository _repository;

    public InstructorService(InstructorRepository repository)
    {
        _repository = repository;
    }

    public List<Instructor> GetAll()
    {
        return _repository.GetAll();
    }

    public Instructor GetById(int id)
    {
        return _repository.GetById(id);
    }

    public void Add(Instructor instructor)
    {
        _repository.Add(instructor);
    }

    public void Update(Instructor instructor)
    {
        _repository.Update(instructor);
    }

    public void Delete(int id)
    {
        var instructor = _repository.GetById(id);

        if (instructor != null)
        {
            _repository.Delete(instructor);
        }
    }
}