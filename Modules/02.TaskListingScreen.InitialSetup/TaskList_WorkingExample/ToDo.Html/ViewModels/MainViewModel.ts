/// <reference path="../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/moment/moment.d.ts" />
/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />

module ToDo.ViewModels {
    export class MainViewModel {
        public ToDos: KnockoutObservableArray = ko.observableArray();

        constructor() {
            this.fetchToDoItems();
        }

        fetchToDoItems() {
            var self = this;

            //self.ToDos.push(ko.mapping.fromJS({ Id: 1, Task: 'Some Task', DueDate: moment().add('days', 3).format('L'), ReminderDate: moment().add('days', 2).format('L'), Priority: 'Normal', Category: 'Honey Do' }));
            //self.ToDos.push(ko.mapping.fromJS({ Id: 2, Task: 'Some Other Task 1', DueDate: moment().add('days', 4).format('L'), ReminderDate: moment().add('days', 3).format('L'), Priority: 'Normal', Category: 'Honey Do' }));
            //self.ToDos.push(ko.mapping.fromJS({ Id: 3, Task: 'Some Other Task 2', DueDate: moment().add('days', 5).format('L'), ReminderDate: moment().add('days', 4).format('L'), Priority: 'Normal', Category: 'Honey Do' }));
            //self.ToDos.push(ko.mapping.fromJS({ Id: 4, Task: 'Some Other Task 3', DueDate: moment().add('days', 6).format('L'), ReminderDate: moment().add('days', 5).format('L'), Priority: 'Normal', Category: 'Honey Do' }));

            var url = "http://localhost:8888/ToDoServices/api/ToDo/";
            self.ToDos.removeAll();

            $.get(url)
                .done((data) => {
                    var temp = self.ToDos();

                    _.each(data, (item) => {
                        var toDoVM = ko.mapping.fromJS(item, {}, new ToDoListItemViewModel());

                        temp.push(toDoVM);
                    });

                    self.ToDos.valueHasMutated();
                });
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

        constructor() {
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
