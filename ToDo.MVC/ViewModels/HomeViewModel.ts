/// <reference path="../Scripts/d.ts/references.ts" />

module ToDo {
    export class HomeViewModel {
        
        public ToDos: KnockoutObservableArray = ko.observableArray();
        public OverdueCount: KnockoutComputed;
        public ActiveCount: KnockoutComputed;
        public TotalCount: KnockoutComputed;

        constructor() {

            this.fetchRemoteToDoList();

            this.OverdueCount = ko.computed(() => {
                var count = _.filter(this.ToDos(), (item) => { return item.Status() == "Overdue" }).length;
                return count;
            });

            this.ActiveCount = ko.computed(() => {
                var count = _.filter(this.ToDos(), (item) => { return item.Status() == "Active" }).length;
                return count;
            });

            this.TotalCount = ko.computed(() => {
                return this.ToDos().length;
            });
        }

        addNewToDo() {
        }

        filterList() {
        }

        fetchRemoteToDoList() {
            this.ToDos.push(new ToDoViewModel( {
                Id: 1, Task: "Fix Issues w/ the Computer",
                DueDate: moment().subtract('days', 2).format("MM/DD/YYYY"), ReminderDate: moment().subtract('days', 1).format("MM/DD/YYYY"),
                Priority: "High", Category: "Personal", Status: "Overdue"
            }));

            this.ToDos.push(new ToDoViewModel({
                Id: 2, Task: "Call Cable company",
                DueDate: moment().format("MM/DD/YYYY"), ReminderDate: moment().format("MM/DD/YYYY"),
                Priority: "High", Category: "Honey Do", Status: "Active"
            }));

            this.ToDos.push(new ToDoViewModel({
                Id: 3, Task: "Order items from Amazon",
                DueDate: moment().add('days', 2).format("MM/DD/YYYY"), ReminderDate: moment().add('days', 1).format("MM/DD/YYYY"),
                Priority: "High", Category: "Personal", Status: "Active"
            }));

            this.ToDos.push(new ToDoViewModel({
                Id: 4, Task: "Order items from Amazon",
                DueDate: moment().add('days', 4).format("MM/DD/YYYY"), ReminderDate: moment().add('days', 3).format("MM/DD/YYYY"),
                Priority: "High", Category: "Personal", Status: "Completed"
            }));
        }
    }
    
    export class ToDoViewModel {
        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableDate = ko.observable();
        public ReminderDate: KnockoutObservableDate = ko.observable();
        public Priority: KnockoutObservableString = ko.observable("");
        public Category: KnockoutObservableString = ko.observable("");
        public Status: KnockoutObservableString = ko.observable("");
        public StatusStyle: KnockoutComputed;
        public IsCompleted: KnockoutComputed;

        constructor(seedDto: any) {
            if (seedDto != undefined) {
                this.Id(seedDto.Id);
                this.Task(seedDto.Task);
                this.DueDate(seedDto.DueDate);
                this.ReminderDate(seedDto.ReminderDate);
                this.Priority(seedDto.Priority);
                this.Category(seedDto.Category);
                this.Status(seedDto.Status);
            }

            this.StatusStyle = ko.computed(() => {
                switch (this.Status()) {
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

            this.IsCompleted = ko.computed(() => {
                var isCompleted = this.Status() == "Completed";
                return isCompleted;
            });
        }
    }

    //export interface IToDoDto {

    //    Id: KnockoutObservableNumber;
    //    Task: KnockoutObservableString;
    //    DueDate: KnockoutObservableDate;
    //    ReminderDate: KnockoutObservableDate;
    //    Priority: KnockoutObservableString;
    //    Category: KnockoutObservableString;
    //    Status: KnockoutObservableString;
    //}
}