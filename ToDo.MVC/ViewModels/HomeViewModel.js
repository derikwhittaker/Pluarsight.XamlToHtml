var ToDo;
(function (ToDo) {
    var HomeViewModel = (function () {
        function HomeViewModel() {
            var _this = this;
            this.ToDos = ko.observableArray();
            this.OriginalToDos = ko.observableArray();
            this.FilterText = ko.observable("");
            this.fetchRemoteToDoList();
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
        HomeViewModel.prototype.addNewToDo = function () {
            var model = new ToDoViewModel(undefined);
            model.Task("Hello");
            var divName = '#todo-edit-modal';
            $(divName).modal('show');
            $(divName).on('shown', function () {
                model.fetchData();
                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });
            $(divName).on('hide', function () {
                ko.cleanNode($(divName)[0]);
                $(divName).off('shown hide');
            });
        };
        HomeViewModel.prototype.deleteToDo = function (id) {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/Delete/" + id;
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (data) {
                    self.OriginalToDos.removeAll();
                    self.ToDos.removeAll();
                    self.fetchRemoteToDoList();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        };
        HomeViewModel.prototype.filterList = function () {
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
        HomeViewModel.prototype.fetchRemoteToDoList = function () {
            var _this = this;
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/";
            $.ajax({
                url: url,
                type: 'Get',
                success: function (data) {
                    var temp = self.ToDos();
                    _.each(data, function (item) {
                        var toDoVM = new ToDoViewModel(item);
                        toDoVM.Parent = _this;
                        temp.push(toDoVM);
                    });
                    self.ToDos.valueHasMutated();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
            this.OriginalToDos(this.ToDos());
        };
        return HomeViewModel;
    })();
    ToDo.HomeViewModel = HomeViewModel;    
    var ToDoViewModel = (function () {
        function ToDoViewModel(seedDto) {
            var _this = this;
            this.Parent = undefined;
            this.Id = ko.observable(0);
            this.Task = ko.observable("");
            this.DueDate = ko.observable();
            this.ReminderDate = ko.observable();
            this.Priority = ko.observable("");
            this.Category = ko.observable("");
            this.Status = ko.observable("");
            this.Priorities = ko.observableArray();
            this.SelectedPriority = ko.observable();
            this.Categories = ko.observableArray();
            this.SelectedCategory = ko.observable();
            this.Statuses = ko.observableArray();
            this.SelectedStatus = ko.observable();
            this.remoteCallCounter = 0;
            this.totalRemoteCallsExpected = 3;
            if(seedDto != undefined) {
                var reminderDate = seedDto.ReminderDate ? moment(seedDto.ReminderDate).format("MM/DD/YYYY") : "";
                this.Id(seedDto.Id);
                this.Task(seedDto.Task);
                this.DueDate(moment(seedDto.DueDate).format("MM/DD/YYYY"));
                this.ReminderDate(reminderDate);
                this.Priority(seedDto.Priority.Description);
                this.Category(seedDto.Category.Description);
                this.Status(seedDto.Status.Description);
            }
            this.StatusStyle = ko.computed(function () {
                switch(_this.Status()) {
                    case "Active":
                        return "circle status-active-color";
                        break;
                    case "Overdue":
                        return "circle status-overdue-color";
                        break;
                    case "Completed":
                        return "circle status-completed-color";
                        break;
                }
            });
            this.IsCompleted = ko.computed(function () {
                var isCompleted = _this.Status() == "Completed";
                return isCompleted;
            });
        }
        ToDoViewModel.prototype.fetchData = function () {
            this.remoteCallCounter = 0;
            this.fetchCategories();
            this.fetchPriorities();
            this.fetchStatuses();
        };
        ToDoViewModel.prototype.fetchCategories = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Categories";
            $.ajax({
                url: url,
                type: 'Get',
                success: function (data) {
                    self.totalRemoteCallsExpected++;
                    self.Categories(data);
                }
            });
        };
        ToDoViewModel.prototype.fetchPriorities = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Priorities";
            $.ajax({
                url: url,
                type: 'Get',
                success: function (data) {
                    self.totalRemoteCallsExpected++;
                    self.Priorities(data);
                }
            });
        };
        ToDoViewModel.prototype.fetchStatuses = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Statuses";
            $.ajax({
                url: url,
                type: 'Get',
                success: function (data) {
                    self.totalRemoteCallsExpected++;
                    self.Statuses(data);
                }
            });
        };
        return ToDoViewModel;
    })();
    ToDo.ToDoViewModel = ToDoViewModel;    
})(ToDo || (ToDo = {}));
