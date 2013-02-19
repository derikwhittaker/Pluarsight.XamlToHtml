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
            this.setupValidation();
        }
        MaintainItemViewModel.prototype.updateRemoteCallCounter = function () {
            this.remoteCallCounter++;
            if(this.remoteCallCounter == this.totalRemoteCallsExpected) {
                this.fetchToDoItem();
            }
        };
        MaintainItemViewModel.prototype.setupValidation = function () {
            var _this = this;
            var self = this;
            ko.validation.init();
            this.Task.extend({
                required: true
            });
            this.DueDate.extend({
                date: true
            });
            this.DueDate.extend({
                validation: {
                    validator: function (updatedValue) {
                        if(updatedValue == undefined) {
                            return true;
                        }
                        var asMoment = moment(updatedValue);
                        var result = asMoment.diff(moment(), 'days');
                        return result >= 0;
                    },
                    message: 'Date cannot be in the past'
                }
            });
            this.ReminderDate.extend({
                validation: {
                    validator: function (updatedValue) {
                        if(updatedValue == undefined) {
                            return true;
                        }
                        var asReinderDate = moment(updatedValue);
                        var asDueDate = moment(self.DueDate());
                        var result = asReinderDate.diff(asDueDate, 'days');
                        return result <= 0;
                    },
                    message: 'Reminder Date must be before Due Date'
                }
            });
            this.IsValid = ko.computed(function () {
                var taskIsValid = _this.Task.isValid();
                var dueDateIsValid = _this.DueDate.isValid();
                var reminderIsValid = _this.ReminderDate.isValid();
                return taskIsValid && dueDateIsValid && reminderIsValid;
            });
        };
        MaintainItemViewModel.prototype.fetchData = function () {
            this.remoteCallCounter = 0;
            this.fetchCategories();
            this.fetchPriorities();
            this.fetchStatuses();
        };
        MaintainItemViewModel.prototype.fetchToDoItem = function () {
            var _this = this;
            var url = "http://localhost:8888/ToDoServices/api/todo/get/" + this.Id();
            $.get(url).done(function (data) {
                _this.OriginalToDoModel(ko.mapping.fromJS(data));
                _this.Task(data.Task);
                _this.DueDate(moment(data.DueDate).format("MM/DD/YYYY"));
                _this.SelectedCategory(ko.mapping.fromJS(data.Category));
                if(data.ReminderDate) {
                    _this.ReminderDate(moment(data.ReminderDate).format("MM/DD/YYYY"));
                }
            }).fail(function (reason) {
                console.error(reason.statusText);
            });
        };
        MaintainItemViewModel.prototype.fetchCategories = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Categories";
            $.get(url).done(function (data) {
                self.updateRemoteCallCounter();
                self.Categories(data);
            });
        };
        MaintainItemViewModel.prototype.fetchPriorities = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Priorities";
            $.get(url).done(function (data) {
                self.updateRemoteCallCounter();
                self.Priorities(data);
            });
        };
        MaintainItemViewModel.prototype.fetchStatuses = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Statuses";
            $.get(url).done(function (data) {
                self.updateRemoteCallCounter();
                self.Statuses(data);
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
            $.post(url, model).done(function (result) {
                var divName = '#todo-edit-modal';
                $(divName).modal('hide');
            });
        };
        return MaintainItemViewModel;
    })();
    ToDo.MaintainItemViewModel = MaintainItemViewModel;    
})(ToDo || (ToDo = {}));
