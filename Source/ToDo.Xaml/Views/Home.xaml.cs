using System.Windows.Controls;
using System.Windows.Navigation;
using ToDo.Xaml.ViewModels;

namespace ToDo.Xaml.Views
{
    public partial class Home : Page
    {
        public Home()
        {
            InitializeComponent();

            DataContext = new HomeViewModel();
        }

        // Executes when the user navigates to this page.
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }
    }
}