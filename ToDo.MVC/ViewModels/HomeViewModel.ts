/// <reference path="../Scripts/d.ts/references.ts" />

module ToDo {
    export class HomeViewModel {
        
        public ToDos: KnockoutObservableArray = ko.observableArray();
        public OverdueCount: KnockoutComputed;
        public ActiveCount: KnockoutComputed;
        public TotalCount: KnockoutComputed;

        constructor() {

            this.ToDos.push({
                Id: 1, Task: "Fix Issues w/ the Computer",
                DueDate: moment().subtract('days', 2).format("MM/DD/YYYY"), ReminderDate: moment().subtract('days', 1).format("MM/DD/YYYY"),
                Priority: "High", Category: "Personal", Status: "Overdue"
            });

            this.ToDos.push({
                Id: 2, Task: "Call Cable company",
                DueDate: moment().format("MM/DD/YYYY"), ReminderDate: moment().format("MM/DD/YYYY"),
                Priority: "High", Category: "Honey Do", Status: "Active"
            });

            this.ToDos.push({
                Id: 3, Task: "Order items from Amazon",
                DueDate: moment().add('days', 2).format("MM/DD/YYYY"), ReminderDate: moment().add('days', 1).format("MM/DD/YYYY"),
                Priority: "High", Category: "Personal", Status: "Active"
            });

            this.OverdueCount = ko.computed(() => {
                return _.where(this.ToDos(), {Status: "Overdue"}).length;
            });

            this.ActiveCount = ko.computed(() => {
                return _.where(this.ToDos(), { Status: "Active" }).length;
            });

            this.TotalCount = ko.computed(() => {
                return this.ToDos().length;
            });
        }

        addNewToDo() {
        }

        filterList() {
        }
    }
    
    export class ToDoViewModel {

        constructor(seedDto: IToDoDto) {
            if (seedDto != undefined) {
                this.Id(seedDto.Id());
                this.Task(seedDto.Task());
                this.DueDate(seedDto.DueDate());
                this.ReminderDate(seedDto.ReminderDate());
                this.Priority(seedDto.Priority());
                this.Category(seedDto.Category());
                this.Status(seedDto.Status());
            }            
        }

        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableDate = ko.observable();
        public ReminderDate: KnockoutObservableDate = ko.observable();
        public Priority: KnockoutObservableString = ko.observable("");
        public Category: KnockoutObservableString = ko.observable("");
        public Status: KnockoutObservableString = ko.observable("");
    }

    export interface IToDoDto {

        Id: KnockoutObservableNumber;
        Task: KnockoutObservableString;
        DueDate: KnockoutObservableDate;
        ReminderDate: KnockoutObservableDate;
        Priority: KnockoutObservableString;
        Category: KnockoutObservableString;
        Status: KnockoutObservableString;
    }
}