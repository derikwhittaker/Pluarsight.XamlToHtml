using System.Windows.Controls;
using GalaSoft.MvvmLight.Messaging;
using ToDo.Xaml.Impl;
using ToDo.Xaml.Impl.Messages;

namespace ToDo.Xaml.Views
{
    public partial class ToDoMaintenanceChildWindow : ChildWindow, IModalWindow
    {
        public ToDoMaintenanceChildWindow()
        {
            InitializeComponent();

            Messenger.Default.Register<CloseDialogMessage>(this, CloseDialogHandler);
        }

        private void CloseDialogHandler(CloseDialogMessage closeDialogMessage)
        {
            this.DialogResult = closeDialogMessage.Success;
        }

    }
}

