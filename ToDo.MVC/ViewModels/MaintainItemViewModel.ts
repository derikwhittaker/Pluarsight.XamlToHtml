/// <reference path="../Scripts/d.ts/references.ts" />
/// <reference path="HomeViewModel.ts" />

module ToDo {
    export class MaintainItemViewModel {
        public Parent: HomeViewModel = undefined;
        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableString = ko.observable();
        public ReminderDate: KnockoutObservableString = ko.observable();
        public Priority: KnockoutObservableString = ko.observable("");
        public Category: KnockoutObservableString = ko.observable("");
        public Status: KnockoutObservableString = ko.observable("");

        public Priorities: KnockoutObservableArray = ko.observableArray();
        public SelectedPriority: KnockoutObservableAny = ko.observable();
        public Categories: KnockoutObservableArray = ko.observableArray();
        public SelectedCategory: KnockoutObservableAny = ko.observable();
        public Statuses: KnockoutObservableArray = ko.observableArray();
        public SelectedStatus: KnockoutObservableAny = ko.observable();

        constructor(toDoId: number) {
            this.Id(toDoId);
            //if (seedDto != undefined) {

            //    var reminderDate = seedDto.ReminderDate ? moment(seedDto.ReminderDate).format("MM/DD/YYYY") : "";

            //    this.Id(seedDto.Id);
            //    this.Task(seedDto.Task);
            //    this.DueDate(moment(seedDto.DueDate).format("MM/DD/YYYY"));
            //    this.ReminderDate(reminderDate);
            //    this.Priority(seedDto.Priority.Description);
            //    this.Category(seedDto.Category.Description);
            //    this.Status(seedDto.Status.Description);
            //}

            this.setupValidation();

        }

        private remoteCallCounter = 0;
        private totalRemoteCallsExpected = 3;

        public setupValidation() {
            this.Task.extend({
                required: true
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

            $.ajax({
                url: url,
                type: 'Get',
                success: (data) => {
                    
                },

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