using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using GalaSoft.MvvmLight.Command;
using ToDo.Models;
using ToDo.Xaml.Clients;
using ToDo.Xaml.Impl;
using ToDo.Xaml.Views;

namespace ToDo.Xaml.ViewModels
{
    public class HomeViewModel : GalaSoft.MvvmLight.ViewModelBase
    {
        private IToDoClient _toDoClient = new ToDoClient();
        private IMetaClient _metaClient = new MetaClient();
        private IModalDialogService _modalDialogService = new ModalDialogService();

        private IList<Models.ToDo> _rawToDoItemsList = new List<Models.ToDo>();
        private ObservableCollection<Models.ToDo> _toDoItems;
        private string _filterText;
        private RelayCommand _filterToDoCommand;
        private RelayCommand<Models.ToDo> _editToDoCommand;
        private RelayCommand<Models.ToDo> _deleteToDoCommand;
        private RelayCommand _addToDoCommand;

        private void RefreshToDoItems()
        {
            _toDoClient.SchduledToDos((results) =>
                {
                    _toDoItems.Clear();
                    _rawToDoItemsList = new List<Models.ToDo>(results);
   
                    foreach (var toDo in _rawToDoItemsList)
                    {
                        _toDoItems.Add(toDo);
                    }

                    RaisePropertyChanged(() => ActiveCount);
                    RaisePropertyChanged(() => OverdueCount);
                    RaisePropertyChanged(() => TotalCount);
                });
        }

        public ObservableCollection<Models.ToDo> ToDoItems
        {
            get
            {
                if (_toDoItems == null)
                {
                    _toDoItems = new ObservableCollection<Models.ToDo>();
                    RefreshToDoItems();
                }

                return _toDoItems;
            }
            set { _toDoItems = value; RaisePropertyChanged(() => ToDoItems); }
        }

        public string FilterText
        {
            get { return _filterText; }
            set
            {
                _filterText = value; 
                RaisePropertyChanged(() => FilterText);

                FilterToDoCommand.RaiseCanExecuteChanged();

                if (string.IsNullOrEmpty(_filterText))
                {
                    FilterToDo();
                }
            }
        }

        public RelayCommand AddToDoCommand
        {
            get { return _addToDoCommand ?? (_addToDoCommand = new RelayCommand(AddToDo)); }
        }

        private void AddToDo()
        {
            _modalDialogService.ShowDialog<ToDoMaintenanceChildWindow>(new ToDoMaintenanceViewModel(_toDoClient, _metaClient, new Models.ToDo{DueDate = DateTime.Now}), result =>
            {
                if (result.HasValue && result.Value)
                {
                    RefreshToDoItems();
                }
            });
        }

        public RelayCommand<Models.ToDo> EditToDoCommand
        {
            get { return _editToDoCommand ?? (_editToDoCommand = new RelayCommand<Models.ToDo>(EditToDo)); }
        }

        private void EditToDo(Models.ToDo toDoToEdit)
        {
            _modalDialogService.ShowDialog<ToDoMaintenanceChildWindow>(new ToDoMaintenanceViewModel(_toDoClient, _metaClient, toDoToEdit), result =>
                {
                    if (result.HasValue && result.Value)
                    {
                        RefreshToDoItems();
                    }
                });
          
        }

        public RelayCommand<Models.ToDo> DeleteToDoCommand
        {
            get { return _deleteToDoCommand ?? (_deleteToDoCommand = new RelayCommand<Models.ToDo>(DeleteToDo)); }
        }

        private void DeleteToDo(Models.ToDo toDo)
        {
            _toDoClient.DeleteToDo(toDo.Id, (result) =>
                {
                    if (result)
                    {
                        var foundMatch = _rawToDoItemsList.FirstOrDefault(x => x.Id == toDo.Id);

                        if (foundMatch != null)
                        {
                            _rawToDoItemsList.Remove(foundMatch);
                            _toDoItems.Remove(foundMatch);
                        }
                    }
                });
        }

        public RelayCommand FilterToDoCommand
        {
            get { return _filterToDoCommand ?? (_filterToDoCommand = new RelayCommand(FilterToDo, CanFilterToDo)); }
        }

        private bool CanFilterToDo()
        {
            return !string.IsNullOrEmpty(FilterText);
        }

        private void FilterToDo()
        {
            var foundItems = _rawToDoItemsList.Where(x => x.Task.ToLower().Contains(FilterText.ToLower())).ToList();

            _toDoItems.Clear();

            foreach (var foundItem in foundItems)
            {
                _toDoItems.Add(foundItem);
            }
        }

        public int OverdueCount
        {
            get
            {
                if (ToDoItems.Any())
                {
                    return ToDoItems.Count(x => x.Status.Id == (int) State.Overdue);
                }
                return 0;
            }
        }

        public int ActiveCount
        {
            get
            {
                if (ToDoItems.Any())
                {
                    return ToDoItems.Count(x => x.Status.Id == (int)State.Active);
                }
                return 0;
            }
        }

        public int TotalCount
        {
            get
            {
                if (ToDoItems.Any())
                {
                    return ToDoItems.Count();
                }
                return 0;
            }
        }
    }
}
