namespace ToDo.Xaml.ViewModels
{
    public class MaintainToDoItemViewModel : GalaSoft.MvvmLight.ViewModelBase
    {
        private readonly Models.ToDo _toDo;

        public MaintainToDoItemViewModel(Models.ToDo toDo)
        {
            _toDo = toDo;
        }
    }
}