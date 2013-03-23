var ToDo;
(function (ToDo) {
    (function (ViewModels) {
        var MainViewModel = (function () {
            function MainViewModel() {
                var _this = this;
                this.ToDos = ko.observableArray();
                this.OriginalToDos = ko.observableArray();
                this.FilterText = ko.observable("");
                this.fetchToDoItems();
                this.OverdueCount = ko.computed(function () {
                    var count = _.filter(_this.ToDos(), function (item) {
                        return item.Status() == "Overdue";
                    }).length;
                    return count;
                });
                this.ActiveCount = ko.computed(function () {
                    var count = _.filter(_this.ToDos(), function (item) {
                        return item.Status() == "Active";
                    }).length;
                    return count;
                });
                this.TotalCount = ko.computed(function () {
                    return _this.ToDos().length;
                });
            }
            MainViewModel.prototype.deleteToDo = function (id) {
                var self = this;
                var url = "http://localhost:8888/ToDoServices/api/ToDo/Delete/" + id;
                $.ajax({
                    url: url,
                    type: 'DELETE',
                    success: function (data) {
                        self.fetchToDoItems();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            };
            MainViewModel.prototype.fetchToDoItems = function () {
                var _this = this;
                var self = this;
                var url = "http://localhost:8888/ToDoServices/api/ToDo/";
                self.OriginalToDos.removeAll();
                self.ToDos.removeAll();
                $.get(url).done(function (data) {
                    var temp = self.ToDos();
                    _.each(data, function (item) {
                        var todoItem = ko.mapping.fromJS(item, {
                        }, new ToDoListItemViewModel());
                        temp.push(todoItem);
                    });
                    self.ToDos.valueHasMutated();
                    self.OriginalToDos(_this.ToDos());
                });
            };
            MainViewModel.prototype.filterList = function () {
                var self = this;
                if(self.FilterText().length == 0) {
                    self.ToDos(self.OriginalToDos());
                } else {
                    var results = _.filter(self.OriginalToDos(), function (item) {
                        return item.Task().toLowerCase().indexOf(self.FilterText().toLowerCase()) >= 0;
                    });
                    self.ToDos(results);
                }
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
                this.Status = ko.observable();
                this.StatusStyle = ko.computed(function () {
                    if(_this.Status() != undefined) {
                        return "circle status-" + _this.Status().Description().toLowerCase() + "-color";
                    } else {
                        return "circle status-active-color";
                    }
                });
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
