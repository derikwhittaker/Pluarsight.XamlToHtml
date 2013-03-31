var ToDo;
(function (ToDo) {
    (function (ViewModels) {
        var MaintainItemViewModel = (function () {
            function MaintainItemViewModel() {
                this.Id = ko.observable(0);
                this.Task = ko.observable("");
                this.DueDate = ko.observable();
                this.ReminderDate = ko.observable();
                this.Priorities = ko.observableArray();
                this.SelectedPriority = ko.observable();
                this.Categories = ko.observableArray();
                this.SelectedCategory = ko.observable();
                this.Statuses = ko.observableArray();
                this.SelectedStatus = ko.observable();
            }
            return MaintainItemViewModel;
        })();
        ViewModels.MaintainItemViewModel = MaintainItemViewModel;        
    })(ToDo.ViewModels || (ToDo.ViewModels = {}));
    var ViewModels = ToDo.ViewModels;
})(ToDo || (ToDo = {}));
