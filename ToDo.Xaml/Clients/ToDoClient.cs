using System;
using System.Collections.Generic;
using ToDo.Models;

namespace ToDo.Xaml.Clients
{
    public interface IToDoClient
    {
        void SchduledToDos( Action<IList<Models.ToDo>> results );
    }

    public class ToDoClient : IToDoClient
    {
        public void SchduledToDos( Action<IList<Models.ToDo>> results )
        {
            var todos = new List<Models.ToDo>
                {
                    new Models.ToDo{Task = "Some Task 1", DueDate = DateTime.Now.AddDays(0), ReminderDate = DateTime.Now.AddDays(0),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Overdue},
                    new Models.ToDo{Task = "Some Task 2", DueDate = DateTime.Now.AddDays(0),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                    new Models.ToDo{Task = "Some Task 3", DueDate = DateTime.Now.AddDays(1), ReminderDate = DateTime.Now.AddDays(0),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                    new Models.ToDo{Task = "Some Task 4", DueDate = DateTime.Now.AddDays(1), ReminderDate = DateTime.Now.AddDays(0),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                    new Models.ToDo{Task = "Some Task 5", DueDate = DateTime.Now.AddDays(2), ReminderDate = DateTime.Now.AddDays(1),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                    new Models.ToDo{Task = "Some Task 6", DueDate = DateTime.Now.AddDays(3), ReminderDate = DateTime.Now.AddDays(2),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                    new Models.ToDo{Task = "Some Task 7", DueDate = DateTime.Now.AddDays(4), ReminderDate = DateTime.Now.AddDays(3),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                    new Models.ToDo{Task = "Some Task 8", DueDate = DateTime.Now.AddDays(5), ReminderDate = DateTime.Now.AddDays(4),
                        Priority = new Priority{Id = 1, Description = "Normal"}, Category = new Category{Id = 1, Description = "Misc"}, State = State.Active},
                };

            results.Invoke(todos);
        } 
    }
}
