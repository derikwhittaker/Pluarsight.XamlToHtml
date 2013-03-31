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
        IList<Models.ToDo> AllItems();
        void Delete(int id);
        IEnumerable<Priority> Properties();
        IEnumerable<Category> Categories();
        IEnumerable<Status> Statuses();
        void Update(Models.ToDo toDo);
        ToDo.Models.ToDo Item(int id);
    }

    public class DataRepository : IDataRepository
    {
        private static IList<Models.ToDo> _inMemeoryToDo = new List<Models.ToDo>();
        private static IList<Priority> _priorities = new List<Priority>();
        private static IList<Category> _categories = new List<Category>();
        private static IList<Status> _statuses = new List<Status>(); 

        static DataRepository()
        {

            _priorities = new List<Priority>
                {
                    new Priority {Id = 1, Description = "Normal"},
                    new Priority {Id = 2, Description = "Medium"},
                    new Priority {Id = 3, Description = "High"},
                    new Priority {Id = 4, Description = "Critical"},
                };

            _categories = new List<Category>
                {
                    new Category{Id = 1, Description = "Honey Do"},
                    new Category{Id = 2, Description = "Quality"},
                    new Category{Id = 3, Description = "Personal"},
                    new Category{Id = 4, Description = "Punishment"},
                };

            _statuses = new List<Status>
                {
                    new Status{Id = (int)State.Active, Description = "Active"},
                    new Status{Id = (int)State.Overdue, Description = "Overdue"},
                    new Status{Id = (int)State.Completed, Description = "Completed"},
                };

            _inMemeoryToDo.Add(BuildToDo(1, "Pickup the dry cleaning", DateTime.Now.AddDays(-1), DateTime.Now.AddDays(-2), "Normal", "Honey Do", State.Overdue));
            _inMemeoryToDo.Add(BuildToDo(2, "Date Night", DateTime.Now.AddDays(5), DateTime.Now.AddDays(4), "High", "Quality", State.Active));
            _inMemeoryToDo.Add(BuildToDo(3, "Call the cable company", DateTime.Now.AddDays(1), DateTime.Now.AddDays(0), "Normal", "Honey Do", State.Active));
            _inMemeoryToDo.Add(BuildToDo(4, "Make Vet Appointment for dog", DateTime.Now.AddDays(2), DateTime.Now.AddDays(1), "Normal", "Honey Do", State.Active));
            _inMemeoryToDo.Add(BuildToDo(5, "Order items off Amazon", DateTime.Now.AddDays(3), null, "Normal", "Personal", State.Active));
            _inMemeoryToDo.Add(BuildToDo(6, "Get the car washed", DateTime.Now.AddDays(3), null, "Normal", "Personal", State.Active));
            _inMemeoryToDo.Add(BuildToDo(7, "Fix the issues w/ the door", DateTime.Now.AddDays(5), DateTime.Now.AddDays(4), "Normal", "Honey Do", State.Active));
            _inMemeoryToDo.Add(BuildToDo(8, "Clean the grill", DateTime.Now.AddDays(5), DateTime.Now.AddDays(4), "Normal", "Personal", State.Active));
            _inMemeoryToDo.Add(BuildToDo(9, "Pick paint color for the walls", DateTime.Now.AddDays(-4), DateTime.Now.AddDays(-3), "Normal", "Honey Do", State.Completed));
            _inMemeoryToDo.Add(BuildToDo(10, "Fix issues w/ the computer", DateTime.Now.AddDays(-3), DateTime.Now.AddDays(-4), "High", "Personal", State.Overdue));

        }

        public IList<Models.ToDo> ActiveItems()
        {
            return _inMemeoryToDo.Where(x => x.Status.Id != (int)State.Completed).OrderBy(x => x.DueDate).ToList();
        }

        public IList<Models.ToDo> AllItems()
        {
            return _inMemeoryToDo.OrderBy(x => x.Status.Id).ThenBy(x => x.DueDate).ToList();
        }

        public void Delete(int id)
        {
            var foundMatch = _inMemeoryToDo.FirstOrDefault(x => x.Id == id);

            if (foundMatch != null)
            {
                _inMemeoryToDo.Remove(foundMatch);
            }
        }

        public IEnumerable<Priority> Properties()
        {
            return _priorities;
        }

        public IEnumerable<Category> Categories()
        {
            return _categories;
        }

        public IEnumerable<Status> Statuses()
        {
            return _statuses;
        }

        public void Update(Models.ToDo toDo)
        {
            if (toDo.Id == 0)
            {
                toDo.Id = _inMemeoryToDo.Count() + 1;
                _inMemeoryToDo.Add(toDo);
            }
            else
            {
                var foundItem = _inMemeoryToDo.FirstOrDefault(x => x.Id == toDo.Id);

                if (foundItem != null )
                {
                    _inMemeoryToDo.Remove(foundItem);
                    _inMemeoryToDo.Add(toDo);
                }
            }
        }

        public Models.ToDo Item(int id)
        {
            var foundItem = _inMemeoryToDo.FirstOrDefault(x => x.Id == id);
            return foundItem;
        }

        private static Models.ToDo BuildToDo(int id, string task, DateTime duedate, DateTime? reminderDate, string priority, string category, State state)
        {
            var priorityInstance = _priorities.FirstOrDefault(x => x.Description == priority);
            var categoryInstance = _categories.FirstOrDefault(x => x.Description == category);
            var statusInstance = _statuses.FirstOrDefault(x => x.Id == (int) state);

            return new Models.ToDo
                {
                    Id = id,
                    Task = task,
                    DueDate = duedate,
                    ReminderDate = reminderDate,
                    Priority = priorityInstance,
                    Category = categoryInstance,
                    Status = statusInstance
                };
        }

    }
}