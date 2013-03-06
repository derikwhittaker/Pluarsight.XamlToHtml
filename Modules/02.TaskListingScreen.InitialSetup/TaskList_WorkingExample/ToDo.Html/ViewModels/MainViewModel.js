var ToDo;
(function (ToDo) {
    (function (ViewModels) {
        var MainViewModel = (function () {
            function MainViewModel() {
                this.ToDos = ko.observableArray();
                var self = this;
                this.fetchToDoItems();
            }
            MainViewModel.prototype.fetchToDoItems = function () {
                var self = this;
                var self = this;
                var url = "http://localhost:8888/ToDoServices/api/ToDo/";
                self.ToDos.removeAll();
                $.get(url).done(function (data) {
                    var temp = self.ToDos();
                    _.each(data, function (item) {
                        var toDoVM = ko.mapping.fromJS(item, {
                        }, new ToDoListItemViewModel());
                        temp.push(toDoVM);
                    });
                    self.ToDos.valueHasMutated();
                });
            };
            return MainViewModel;
        })();
        ViewModels.MainViewModel = MainViewModel;        
        var ToDoListItemViewModel = (function () {
            function ToDoListItemViewModel() {
                var _this = this;
                this.Id = ko.observable(0);
                this.Task = ko.observable("");
                this.DueDate = ko.observable("");
                this.ReminderDate = ko.observable("");
                this.Priority = ko.observable("");
                this.Category = ko.observable("");
                this.DisplayDueDate = ko.computed(function () {
                    var displayDate = "";
                    if(_this.DueDate() != undefined && _this.DueDate() != "") {
                        displayDate = moment(_this.DueDate()).format('L');
                    }
                    return displayDate;
                });
                this.DisplayReminderDate = ko.computed(function () {
                    var displayDate = "";
                    if(_this.ReminderDate() != undefined && _this.ReminderDate() != "") {
                        displayDate = moment(_this.ReminderDate()).format('L');
                    }
                    return displayDate;
                });
            }
            return ToDoListItemViewModel;
        })();
        ViewModels.ToDoListItemViewModel = ToDoListItemViewModel;        
    })(ToDo.ViewModels || (ToDo.ViewModels = {}));
    var ViewModels = ToDo.ViewModels;
})(ToDo || (ToDo = {}));
