using System;
namespace ToDo.Models
{
    public class ToDo
    {
        public int Id { get; set; }
        public string Task { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReminderDate { get; set; }
        public Priority Priority { get; set; }
        public Category Category { get; set; }
        public State State { get; set; }
    }

    public class Priority
    {
        public int Id { get; set; }
        public string Description { get; set; }
    }

    public class Category
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
