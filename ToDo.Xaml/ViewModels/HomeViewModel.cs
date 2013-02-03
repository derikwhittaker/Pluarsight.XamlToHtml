using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using GalaSoft.MvvmLight.Command;
using ToDo.Xaml.Clients;

namespace ToDo.Xaml.ViewModels
{
    public class HomeViewModel : GalaSoft.MvvmLight.ViewModelBase
    {
        private IList<Models.ToDo> _rawToDoItemsList = new List<Models.ToDo>();
        private ObservableCollection<Models.ToDo> _toDoItems;
        private string _filterText;
        private IToDoClient _toDoClient = new ToDoClient();
        private RelayCommand _filterToDoCommand;

        private void RefreshToDoItems()
        {

            _toDoClient.SchduledToDos((results) =>
                {
                    _rawToDoItemsList = new List<Models.ToDo>(results);
                    _toDoItems = new ObservableCollection<Models.ToDo>(_rawToDoItemsList);
                    
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
            }
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
    }
}
