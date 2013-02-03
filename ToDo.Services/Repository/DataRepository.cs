using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToDo.Models;

namespace ToDo.Services.Repository
{
    public interface IDataRepository
    {
        IList<Models.ToDo> ActiveItems();
        void Delete(int id);
    }

    public class DataRepository : IDataRepository
    {
        private static IList<Models.ToDo> _inMemeoryToDo = new List<Models.ToDo>();

        static DataRepository()
        {
            _inMemeoryToDo.Add(BuildToDo(1, "Pickup the dry cleaning", DateTime.Now.AddDays(-1), DateTime.Now.AddDays(-2), "Normal", "Honey Do", State.Overdue));
            _inMemeoryToDo.Add(BuildToDo(2, "Date Night", DateTime.Now.AddDays(5), DateTime.Now.AddDays(4), "High", "Quality", State.Active));
            _inMemeoryToDo.Add(BuildToDo(3, "Call the cabel company", DateTime.Now.AddDays(1), DateTime.Now.AddDays(0), "Normal", "Honey Do", State.Active));
            _inMemeoryToDo.Add(BuildToDo(4, "Make Vet Appointment for dog", DateTime.Now.AddDays(2), DateTime.Now.AddDays(1), "Normal", "Honey Do", State.Active));
            _inMemeoryToDo.Add(BuildToDo(5, "Order items off Amazon", DateTime.Now.AddDays(3), null, "Normal", "Personal", State.Active));
            _inMemeoryToDo.Add(BuildToDo(6, "Get the car washed", DateTime.Now.AddDays(3), null, "Normal", "Personal", State.Active));
            _inMemeoryToDo.Add(BuildToDo(7, "Fix the issues w/ the door", DateTime.Now.AddDays(5), DateTime.Now.AddDays(4), "Normal", "Honey Do", State.Active));
            _inMemeoryToDo.Add(BuildToDo(8, "Clean the grill", DateTime.Now.AddDays(5), DateTime.Now.AddDays(4), "Low", "Personal", State.Active));
            _inMemeoryToDo.Add(BuildToDo(9, "Pick paint color for the walls", DateTime.Now.AddDays(-4), DateTime.Now.AddDays(-3), "Normal", "Honey Do", State.Completed));
            _inMemeoryToDo.Add(BuildToDo(10, "Fix issues w/ the computer", DateTime.Now.AddDays(-3), DateTime.Now.AddDays(-4), "High", "Personal", State.Overdue));
      
        }

        public IList<Models.ToDo> ActiveItems()
        {
            return _inMemeoryToDo.Where(x => x.State != State.Completed).OrderBy(x => x.DueDate).ToList();
        }

        public void Delete(int id)
        {
            var foundMatch = _inMemeoryToDo.FirstOrDefault(x => x.Id == id);

            if (foundMatch != null)
            {
                _inMemeoryToDo.Remove(foundMatch);
            }
        }

        private static Models.ToDo BuildToDo(int id, string task, DateTime duedate, DateTime? reminderDate, string priority, string category, State state)
        {
            return new Models.ToDo
                {
                    Id = id,
                    Task = task,
                    DueDate = duedate,
                    ReminderDate = reminderDate,
                    Priority = new Priority { Description = priority },
                    Category = new Category { Description = category},
                    State = state
                };
        }

    }
}