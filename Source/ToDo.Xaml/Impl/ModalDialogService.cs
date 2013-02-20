using System;
using ToDo.Xaml.Clients;

namespace ToDo.Xaml.Impl
{
    public interface IModalWindow
    {
        bool? DialogResult { get; set; }
        event EventHandler Closed;
        void Show();
        object DataContext { get; set; }
        void Close();
    }

    public interface IModalDialogService
    {
        void ShowDialog<TView>(Action<bool?> onDialogClose = null)
            where TView : IModalWindow;
        void ShowDialog<TView>(object dataContext, Action<bool?> onDialogClose = null)
            where TView : IModalWindow;
        void ShowDialog<TViewModel, TView>(TViewModel viewModel, Action<TViewModel, bool?> onDialogClose = null)
            where TView : IModalWindow;

        void ShowDialog<TViewModel, TView>(Action<TViewModel, bool?> onDialogClose = null) where TView : IModalWindow;
    }

    public class ModalDialogService : IModalDialogService
    {
        public void ShowDialog<TView>(Action<bool?> onDialogClose = null)
            where TView : IModalWindow
        {
            ShowDialog<TView>(null, onDialogClose);
        }

        public void ShowDialog<TView>(object dataContext, Action<bool?> onDialogClose = null)
            where TView : IModalWindow
        {
            var dialog = Activator.CreateInstance<TView>() as IModalWindow;

            if (onDialogClose != null)
            {
                dialog.Closed += (sender, e) => onDialogClose(dialog.DialogResult);
            }

            dialog.DataContext = dataContext;

            dialog.Show();
        }
        
        public void ShowDialog<TViewModel, TView>(TViewModel viewModel, Action<TViewModel, bool?> onDialogClose = null)
            where TView : IModalWindow
        {
            var dialog = Activator.CreateInstance<TView>() as IModalWindow;

            dialog.DataContext = viewModel;

            if (onDialogClose != null)
            {
                dialog.Closed += (sender, e) => onDialogClose(viewModel, dialog.DialogResult);
            }

            dialog.Show();
        }

        public void ShowDialog<TViewModel, TView>(Action<TViewModel, bool?> onDialogClose = null) where TView : IModalWindow
        {
            var dialog = Activator.CreateInstance<TView>() as IModalWindow;

            if (onDialogClose != null)
            {
                dialog.Closed += (sender, e) =>
                {
                    var viewModel = (TViewModel)dialog.DataContext;

                    onDialogClose(viewModel, dialog.DialogResult);
                };
            }

            dialog.Show();
        }

    }
}
