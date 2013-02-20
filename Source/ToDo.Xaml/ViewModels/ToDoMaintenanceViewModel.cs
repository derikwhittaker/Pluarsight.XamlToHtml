using System;
using System.Collections.ObjectModel;
using System.Linq;
using GalaSoft.MvvmLight.Command;
using GalaSoft.MvvmLight.Messaging;
using ToDo.Models;
using ToDo.Xaml.Clients;
using ToDo.Xaml.Impl.Messages;

namespace ToDo.Xaml.ViewModels
{
    public class ToDoMaintenanceViewModel : BaseValidationViewModel
    {
        private readonly IToDoClient _toDoClient;
        private readonly IMetaClient _metaClient;
        private readonly Models.ToDo _toDo;
        private ObservableCollection<Priority> _priorities;
        private ObservableCollection<Category> _categories;
        private ObservableCollection<Status> _statuses;
        private string _task;
        private DateTime _dueDate;
        private DateTime? _reminderDate;
        private RelayCommand _saveCommand;
        private Category _selectedCategory;
        private Priority _selectedPriority;
        private Status _selectedStatus;
        private RelayCommand _cancelCommand;

        public ToDoMaintenanceViewModel( IToDoClient toDoClient, IMetaClient metaClient, Models.ToDo toDo)
        {
            _toDoClient = toDoClient;
            _metaClient = metaClient;
            _toDo = toDo;
            Initialize();
        }

        private void Initialize()
        {
            _metaClient.Categories((results) =>
                {
                    Categories = new ObservableCollection<Category>(results);
                    if (_toDo.Category != null)
                    {
                        SelectedCategory = results.FirstOrDefault(x => x.Id == _toDo.Category.Id);
                    }
                });

            _metaClient.Priorities((results) =>
                {
                    Priorities = new ObservableCollection<Priority>(results);
                    if (_toDo.Priority != null)
                    {
                        SelectedPriority = results.FirstOrDefault(x => x.Id == _toDo.Priority.Id);
                    }
                });

            _metaClient.Statuses((results) =>
            {
                Statuses = new ObservableCollection<Status>(results);
                if (_toDo.Status != null)
                {
                    SelectedStatus = results.FirstOrDefault(x => x.Id == _toDo.Status.Id);    
                }
                
            });

            Task = _toDo.Task;
            DueDate = _toDo.DueDate;
            ReminderDate = _toDo.ReminderDate;
        }

        protected override void SetupValidation()
        {
            AddValidationFunction(() => Task, () => !string.IsNullOrEmpty(Task) ? null : "Task is required");
            AddValidationFunction(() => DueDate, () =>
                {
                    if ( DueDate == DateTime.MinValue)
                    {
                        return "Due Date is Required";
                    }

                    return null;
                });

            AddValidationFunction(() => SelectedCategory, () => SelectedCategory != null ? null : "Category is required");
            AddValidationFunction(() => SelectedPriority, () => SelectedPriority != null ? null : "Priority is required");
            AddValidationFunction(() => SelectedStatus, () => SelectedStatus != null ? null : "Status is required");
        }

        public RelayCommand CancelCommand
        {
            get
            {
                return _cancelCommand ?? (_cancelCommand = new RelayCommand(() => Messenger.Default.Send(new CloseDialogMessage {Success = false})));
            }
        }

        public RelayCommand SaveCommand
        {
            get { return _saveCommand ?? (_saveCommand = new RelayCommand(Save, CanSave)) ; }
        }

        private bool CanSave()
        {
            return true;
        }

        private void Save()
        {
            _toDo.Task = Task;
            _toDo.DueDate = DueDate;
            _toDo.ReminderDate = ReminderDate;
            _toDo.Category = SelectedCategory;
            _toDo.Priority = SelectedPriority;
            _toDo.Status = SelectedStatus;

            _toDoClient.UpdateToDo(_toDo, (result) => Messenger.Default.Send(new CloseDialogMessage{Success = result}));
        }

        public ObservableCollection<Category> Categories
        {
            get { return _categories; }
            set { _categories = value; RaisePropertyChanged(() => Categories); }
        }

        public Category SelectedCategory
        {
            get { return _selectedCategory; }
            set { _selectedCategory = value; RaisePropertyChanged( () => SelectedCategory) ; }
        }

        public ObservableCollection<Priority> Priorities
        {
            get { return _priorities; }
            set { _priorities = value; RaisePropertyChanged(() => Priorities); }
        }

        public Priority SelectedPriority
        {
            get { return _selectedPriority; }
            set { _selectedPriority = value; RaisePropertyChanged(() => SelectedPriority); }
        }

        public ObservableCollection<Status> Statuses
        {
            get { return _statuses; }
            set { _statuses = value; RaisePropertyChanged(() => Statuses); }
        }

        public Status SelectedStatus
        {
            get { return _selectedStatus; }
            set { _selectedStatus = value; RaisePropertyChanged(() => SelectedStatus); }
        }

        public string Task
        {
            get { return _task; }
            set { _task = value; RaisePropertyChanged(() => Task); }
        }

        public DateTime DueDate
        {
            get { return _dueDate; }
            set { _dueDate = value; RaisePropertyChanged(() => DueDate); }
        }

        public DateTime? ReminderDate
        {
            get { return _reminderDate; }
            set { _reminderDate = value; RaisePropertyChanged(() => ReminderDate); }
        }
    }
}