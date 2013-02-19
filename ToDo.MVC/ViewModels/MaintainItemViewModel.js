var ToDo;
(function (ToDo) {
    var MaintainItemViewModel = (function () {
        function MaintainItemViewModel(toDoId) {
            this.Parent = undefined;
            this.OriginalToDoModel = ko.observable();
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
            this.remoteCallCounter = 0;
            this.totalRemoteCallsExpected = 3;
            this.Id(toDoId);
            $("#dueDatePicker").datepicker();
            $("#reminderDatePicker").datepicker();
        }
        MaintainItemViewModel.prototype.setupValidation = function () {
            this.Task.extend({
                required: true
            });
        };
        MaintainItemViewModel.prototype.fetchData = function () {
            this.remoteCallCounter = 0;
            this.fetchToDoItem();
            this.fetchCategories();
            this.fetchPriorities();
            this.fetchStatuses();
        };
        MaintainItemViewModel.prototype.fetchToDoItem = function () {
            var _this = this;
            var url = "http://localhost:8888/ToDoServices/api/todo/get/" + this.Id();
            $.ajax({
                url: url,
                type: 'Get',
                success: function (data) {
                    _this.OriginalToDoModel(ko.mapping.fromJS(data));
                    _this.Task(data.Task);
                    _this.DueDate(moment(data.DueDate).format("MM/DD/YYYY"));
                    _this.ReminderDate(moment(data.ReminderDate).format("MM/DD/YYYY"));
                    _this.setupValidation();
                }
            });
        };
        MaintainItemViewModel.prototype.fetchCategories = function () {
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
        MaintainItemViewModel.prototype.fetchPriorities = function () {
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
        MaintainItemViewModel.prototype.fetchStatuses = function () {
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
        MaintainItemViewModel.prototype.saveToDo = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/Update";
            var model = {
                Id: self.Id(),
                Task: self.Task(),
                DueDate: self.DueDate(),
                ReminderDate: self.ReminderDate(),
                Category: ko.toJS(self.SelectedCategory),
                Priority: ko.toJS(self.SelectedPriority),
                Status: ko.toJS(self.SelectedStatus)
            };
            $.ajax({
                url: url,
                type: 'POST',
                data: model,
                success: function (result) {
                    var divName = '#todo-edit-modal';
                    $(divName).modal('hide');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        };
        return MaintainItemViewModel;
    })();
    ToDo.MaintainItemViewModel = MaintainItemViewModel;    
})(ToDo || (ToDo = {}));
