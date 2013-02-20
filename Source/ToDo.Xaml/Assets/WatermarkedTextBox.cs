using System.Windows;
using System.Windows.Controls;

namespace ToDo.Xaml.Assets
{
    public class WatermarkedTextBox : TextBox
    {
        public WatermarkedTextBox()
            : base()
        {
            this.DefaultStyleKey = typeof(WatermarkedTextBox);

            this.TextChanged += (o, e) =>
            {
                if (string.IsNullOrEmpty(Text))
                    IsWatermarkVisible = true;
                else
                    IsWatermarkVisible = false;
            };

        }

        public override void OnApplyTemplate()
        {

            if (string.IsNullOrEmpty(Text))
                IsWatermarkVisible = true;
            else
                IsWatermarkVisible = false;

            base.OnApplyTemplate();
        }


        public string Watermark
        {
            get { return (string)GetValue(WatermarkProperty); }
            set { SetValue(WatermarkProperty, value); }
        }
        public static readonly DependencyProperty WatermarkProperty =
            DependencyProperty.Register("Watermark", typeof(string), typeof(WatermarkedTextBox), new PropertyMetadata(string.Empty));



        public bool IsWatermarkVisible
        {
            get { return (bool)GetValue(IsWatermarkVisibleProperty); }
            set { SetValue(IsWatermarkVisibleProperty, value); }
        }
        public static readonly DependencyProperty IsWatermarkVisibleProperty =
            DependencyProperty.Register("IsWatermarkVisible", typeof(bool), typeof(WatermarkedTextBox), new PropertyMetadata(false));
    }
}
