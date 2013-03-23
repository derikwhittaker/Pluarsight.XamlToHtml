namespace ToDo.Models
{
    public class Status
    {
        public int Id { get; set; }
        public string Description { get; set; }
    }

    public enum State
    {
        Unknown = 0,
        Active = 1,
        Overdue = 2,
        Completed = 3
    }
}