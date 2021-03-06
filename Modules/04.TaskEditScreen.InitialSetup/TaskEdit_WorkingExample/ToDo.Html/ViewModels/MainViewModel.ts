
/// <reference path="../Scripts/typings/bootstrap/bootstrap.d.ts" />
/// <reference path="../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/moment/moment.d.ts" />
/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />

/// <reference path="MaintainItemViewModel.ts" />

module ToDo.ViewModels {
    export class MainViewModel {
        public ToDos: KnockoutObservableArray = ko.observableArray();
        public OriginalToDos: KnockoutObservableArray = ko.observableArray();
        public FilterText: KnockoutObservableString = ko.observable("");
        
        public OverdueCount: KnockoutComputed;
        public ActiveCount: KnockoutComputed;
        public TotalCount: KnockoutComputed;

        constructor() {
            this.fetchToDoItems();

            this.OverdueCount = ko.computed(() => {
                var count = _.filter(this.ToDos(), (item) => { return item.Status().Description() == "Overdue" }).length;
                return count;
            });

            this.ActiveCount = ko.computed(() => {
                var count = _.filter(this.ToDos(), (item) => {
                    return item.Status().Description() == "Active"
                }).length;
                return count;
            });

            this.TotalCount = ko.computed(() => {
                return this.ToDos().length;
            });
        }

        addNewToDo() {
            var self = this;
            var model = new MaintainItemViewModel();

            var divName = '#todo-edit-modal'

            $(divName).modal('show');

            $(divName).on('shown', () => {
                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });

        }

        deleteToDo(id: number) {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/Delete/" + id;
            $.ajax(
                {
                    url: url,
                    type: 'Delete',
                    success: (data) => {
                        self.fetchToDoItems();
                    },                    error: (XMLHttpRequest, textStatus, errorThrow) => { }
                });
        }

        fetchToDoItems() {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/";

            self.ToDos.removeAll();
            self.OriginalToDos.removeAll();

            $.get(url).done(data => {
                var temp = self.ToDos();

                _.each(data, (item) => {
                    var todoItem = ko.mapping.fromJS(item, {},
                        new ToDoListItemViewModel());

                    temp.push(todoItem);
                });

                self.ToDos.valueHasMutated();
                self.OriginalToDos(self.ToDos());
            });
        }

        filterList() {
            var self = this;

            if (this.FilterText().length == 0) {
                self.ToDos(this.OriginalToDos());
            }
            else {

                var results = _.filter(self.OriginalToDos(), function (item) {
                    return item.Task().toLowerCase().indexOf(self.FilterText().toLocaleLowerCase()) >= 0;
                });

                self.ToDos(results);
            }
        }

    }

    export class ToDoListItemViewModel {
        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableString = ko.observable("");
        public ReminderDate: KnockoutObservableString = ko.observable("");
        public Priority: KnockoutObservableString = ko.observable("");
        public Category: KnockoutObservableString = ko.observable("");
        
        public DisplayDueDate: KnockoutComputed;
        public DisplayReminderDate: KnockoutComputed;

        public Status: KnockoutObservableAny = ko.observable();
        public StatusStyle: KnockoutComputed;

        constructor() {
            this.StatusStyle = ko.computed(() => {
                if (this.Status() != undefined) {
                    return "circle status-" + this.Status().Description().toLowerCase() + "-color"
                }
                else {
                    return "circle status-active-color"
                }
            });


            this.DisplayDueDate = ko.computed(() => {
                var displayDate = "";
                if (this.DueDate() != undefined && this.DueDate() != "") {
                    displayDate = moment(this.DueDate()).format('L');
                }
                return displayDate;
            });

            this.DisplayReminderDate = ko.computed(() => {
                var displayDate = "";
                if (this.ReminderDate() != undefined && this.ReminderDate() != "") {
                    displayDate = moment(this.ReminderDate()).format('L');
                }
                return displayDate;
            });
        }
    }
}