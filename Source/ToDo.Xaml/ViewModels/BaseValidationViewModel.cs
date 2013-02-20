using System;
using System.ComponentModel;
using System.Linq.Expressions;

namespace ToDo.Xaml.ViewModels
{
    public abstract class BaseValidationViewModel : GalaSoft.MvvmLight.ViewModelBase, IDataErrorInfo
    {
        private IViewModelValidator _viewModelValidator = new ViewModelValidator();

        protected BaseValidationViewModel()
        {
            SetupValidation();
        }

        protected abstract void SetupValidation();

        public string Error
        {
            get { return null; }
        }

        public string this[string columnName]
        {
            get { return (_viewModelValidator == null) ? null : _viewModelValidator.ValidateProperty(columnName); }
        }

        public virtual bool IsValid
        {
            get { return _viewModelValidator == null || _viewModelValidator.IsValid; }
        }

        protected void AddValidationFunction<T>(Expression<Func<T>> property, Func<string> validationFunction)
        {
            if (_viewModelValidator != null)
            {
                var propertyName = _viewModelValidator.GetPropertyName(property);
                _viewModelValidator.AddValidationFunction(propertyName, validationFunction);
            }
        }
    }
}
