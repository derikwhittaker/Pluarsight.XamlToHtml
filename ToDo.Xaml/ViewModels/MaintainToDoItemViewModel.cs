using System;
using System.Collections.ObjectModel;
using ToDo.Models;
using ToDo.Xaml.Clients;

namespace ToDo.Xaml.ViewModels
{
    public class MaintainToDoItemViewModel : GalaSoft.MvvmLight.ViewModelBase
    {
        private readonly IMetaClient _metaClient;
        private readonly Models.ToDo _toDo;
        private ObservableCollection<Priority> _priorities;
        private ObservableCollection<Category> _categories;
        private ObservableCollection<Status> _statuses;

        public MaintainToDoItemViewModel( IMetaClient metaClient, Models.ToDo toDo)
        {
            _metaClient = metaClient;
            _toDo = toDo;
            Initialize();
        }

        private void Initialize()
        {
            _metaClient.Categories((results) =>
                {
                    Categories = new ObservableCollection<Category>(results);
                });

            _metaClient.Priorities((results) =>
                {
                    Priorities = new ObservableCollection<Priority>(results);
                });

            _metaClient.Statuses((results) =>
            {
                Statuses = new ObservableCollection<Status>(results);
            });
        }

        public ObservableCollection<Category> Categories
        {
            get { return _categories; }
            set { _categories = value; RaisePropertyChanged(() => Categories); }
        }

        public ObservableCollection<Priority> Priorities
        {
            get { return _priorities; }
            set { _priorities = value; RaisePropertyChanged(() => Priorities); }
        }

        public ObservableCollection<Status> Statuses
        {
            get { return _statuses; }
            set { _statuses = value; RaisePropertyChanged(() => Statuses); }
        }
    }
}