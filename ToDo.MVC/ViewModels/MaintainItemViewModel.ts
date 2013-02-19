/// <reference path="../Scripts/d.ts/references.ts" />
/// <reference path="HomeViewModel.ts" />

module ToDo {
    export class MaintainItemViewModel {
        public Parent: HomeViewModel = undefined;
        public OriginalToDoModel: KnockoutObservableAny = ko.observable();
        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableString = ko.observable();
        public ReminderDate: KnockoutObservableString = ko.observable();

        public Priorities: KnockoutObservableArray = ko.observableArray();
        public SelectedPriority: KnockoutObservableAny = ko.observable();
        public Categories: KnockoutObservableArray = ko.observableArray();
        public SelectedCategory: KnockoutObservableAny = ko.observable();
        public Statuses: KnockoutObservableArray = ko.observableArray();
        public SelectedStatus: KnockoutObservableAny = ko.observable();

        constructor(toDoId: number) {
            this.Id(toDoId);

            $("#dueDatePicker").datepicker();
            $("#reminderDatePicker").datepicker();

            this.setupValidation();
        }

        private remoteCallCounter = 0;
        private totalRemoteCallsExpected = 3;

        public setupValidation() {
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
                        if (updatedValue == undefined) { return true; }

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
                        if (updatedValue == undefined) { return true; }

                        var asReinderDate = moment(updatedValue);
                        var asDueDate = moment(self.DueDate());

                        var result = asReinderDate.diff(asDueDate, 'days');
                        return result <= 0;
                    },
                    message: 'Reminder Date must be before Due Date'
                }
            });

            //ko.validation.init({
            //    errorMessageClass: 'field-validation-error'
            //});

            
        }

        public fetchData() {
            this.remoteCallCounter = 0;
            this.fetchToDoItem();
            this.fetchCategories();
            this.fetchPriorities();
            this.fetchStatuses();
        }

        fetchToDoItem() {
            var url = "http://localhost:8888/ToDoServices/api/todo/get/" + this.Id();

            $.get(url)
                .done((data) => {
                    this.OriginalToDoModel(ko.mapping.fromJS(data));

                    this.Task(data.Task);
                    this.DueDate(moment(data.DueDate).format("MM/DD/YYYY"));

                    if (data.ReminderDate) {
                        this.ReminderDate(moment(data.ReminderDate).format("MM/DD/YYYY"));
                    }
                        
                })
                .fail((reason) => {
                    
                });

        }

        fetchCategories() {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Categories";

            $.ajax({
                url: url,
                type: 'Get',
                success: (data) => {
                    self.totalRemoteCallsExpected++;
                    self.Categories(data);
                },

            });
        }

        fetchPriorities() {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Priorities";

            $.ajax({
                url: url,
                type: 'Get',
                success: (data) => {
                    self.totalRemoteCallsExpected++;
                    self.Priorities(data);

                },

            });
        }

        fetchStatuses() {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/Meta/Statuses";

            $.ajax({
                url: url,
                type: 'Get',
                success: (data) => {
                    self.totalRemoteCallsExpected++;
                    self.Statuses(data);
                },

            });
        }

        saveToDo() {
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
                success: (result) => {

                    var divName = '#todo-edit-modal'
                    $(divName).modal('hide');

                },
                error: (XMLHttpRequest, textStatus, errorThrown) => { }
            });
        }
    }
}