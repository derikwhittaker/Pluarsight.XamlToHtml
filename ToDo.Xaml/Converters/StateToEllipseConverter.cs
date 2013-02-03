using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace ToDo.Xaml.Converters
{
    public class StateToEllipseConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var status = value != null ? value.ToString() : "";

            switch (status)
            {
                case "Active":
                    return GetStyle("ActiveStatusElipseStyle");

                case "Overdue":
                    return GetStyle("OverdueStatusElipseStyle");

                case "Completed":
                    return GetStyle("CompletedStatusElipseStyle");

                default:
                    return GetStyle("ActiveStatusElipseStyle");
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }

        public virtual object GetStyle(string styleToUse)
        {
            var style = App.Current.Resources[styleToUse];

            return style as Style;
        }
    }
}
