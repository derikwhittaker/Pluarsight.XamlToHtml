using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace ToDo.Xaml.ViewModels
{
    public interface IViewModelValidator
    {
        void AddValidationFunction(string propertyName, Func<string> validationFunction);
        string ValidateProperty(string propertyName);
        bool IsPropertyValid(string propertyName);
        bool IsPropertyValid<T>(Expression<Func<T>> property);
        bool IsValid { get; }
        void ClearValidationFunctions();
        int GetInvalidPropertyCount(params string[] propertyNames);
        string GetPropertyName<T>(Expression<Func<T>> propertyExpression);
    }

    public class ViewModelValidator : IViewModelValidator
    {
        private readonly Dictionary<string, List<Func<string>>> _validationFunctions = new Dictionary<string, List<Func<string>>>();

        public void AddValidationFunction(string propertyName, Func<string> validationFunction)
        {
            if (_validationFunctions.ContainsKey(propertyName) == false)
            {
                _validationFunctions.Add(propertyName, new List<Func<string>>());
            }

            _validationFunctions[propertyName].Add(validationFunction);
        }

        public string ValidateProperty(string propertyName)
        {
            var errors = new StringBuilder();

            try
            {
                if (_validationFunctions.ContainsKey(propertyName))
                {
                    foreach (var func in _validationFunctions[propertyName])
                    {
                        var error = func.Invoke();

                        if (errors.Length > 0 && error != null)
                        {
                            errors.AppendLine();
                        }

                        if (error != null)
                        {
                            errors.Append(error);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Validation function probably threw an exception, log it
                Debug.WriteLine("While validating {0} there was an error o {1}", propertyName, ex.Message);
            }

            return (errors.Length == 0) ? null : errors.ToString();
        }

        public bool IsPropertyValid( string propertyName )
        {
            var result = ValidateProperty(propertyName);

            return result == null;
        }
        
        public bool IsPropertyValid<T>( Expression<Func<T>> property)
        {
            var propertyName = GetPropertyName(property);

            return IsPropertyValid(propertyName);
        }

        public bool IsValid
        {
            get
            {
                return _validationFunctions.Keys.All(propertyName => ValidateProperty(propertyName) == null);
            }
        }

        public void ClearValidationFunctions()
        {
            _validationFunctions.Clear();
        }

        public int GetInvalidPropertyCount(params string[] propertyNames)
        {
            return propertyNames.Count(propertyName => ValidateProperty(propertyName) != null);
        }

        public int ExistingFunctionCount { get { return _validationFunctions.Count; } }

        public string GetPropertyName<T>(Expression<Func<T>> propertyExpression)
        {
            if (propertyExpression == null)
            {
                throw new ArgumentNullException("propertyExpression");
            }

            var body = propertyExpression.Body as MemberExpression;

            if (body == null)
            {
                throw new ArgumentException("Invalid argument", "propertyExpression");
            }

            var property = body.Member as PropertyInfo;

            if (property == null)
            {
                throw new ArgumentException("Argument is not a property", "propertyExpression");
            }

            return property.Name;
        }
    }
}
