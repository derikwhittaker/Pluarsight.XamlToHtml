var ToDo;
(function (ToDo) {
    var ToDoItemViewModel = (function () {
        function ToDoItemViewModel(seedData) {
            var _this = this;
            this.Id = ko.observable(0);
            this.Task = ko.observable("");
            this.DueDate = ko.observable("");
            this.ReminderDate = ko.observable("");
            this.Priority = ko.observable("");
            this.Category = ko.observable("");
            this.Status = ko.observable("");
            this.Id(seedData.Id);
            this.Task(seedData.Task);
            this.DueDate(moment(seedData.DueDate).format("MM/DD/YYYY"));
            this.ReminderDate(seedData.ReminderDate ? moment(seedData.ReminderDate).format("MM/DD/YYYY") : "");
            this.Priority(seedData.Priority.Description);
            this.Category(seedData.Category.Description);
            this.Status(seedData.Status.Description);
            this.StatusStyle = ko.computed(function () {
                return "circle status-" + _this.Status().toLowerCase() + "-color";
            });
            this.IsCompleted = ko.computed(function () {
                var isCompleted = _this.Status() == "Completed";
                return isCompleted;
            });
        }
        return ToDoItemViewModel;
    })();
    ToDo.ToDoItemViewModel = ToDoItemViewModel;    
})(ToDo || (ToDo = {}));
