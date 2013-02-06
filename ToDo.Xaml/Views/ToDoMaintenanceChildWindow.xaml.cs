using System.Windows;
using System.Windows.Controls;
using ToDo.Xaml.Impl;

namespace ToDo.Xaml.Views
{
    public partial class ToDoMaintenanceChildWindow : ChildWindow, IModalWindow
    {
        public ToDoMaintenanceChildWindow()
        {
            InitializeComponent();
        }

        private void OKButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = false;
        }
    }
}

