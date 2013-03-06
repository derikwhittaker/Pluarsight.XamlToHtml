/// <reference path="../Scripts/d.ts/references.ts" />

module ToDo {
    export class ToDoItemViewModel {

        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableString = ko.observable("");
        public ReminderDate: KnockoutObservableString = ko.observable("");
        public Priority: KnockoutObservableString = ko.observable("");
        public Category: KnockoutObservableString = ko.observable("");
        public Status: KnockoutObservableString = ko.observable("");
        public StatusStyle: KnockoutComputed;
        public IsCompleted: KnockoutComputed;

        constructor(seedData: any) {
            this.Id(seedData.Id);
            this.Task(seedData.Task);
            this.DueDate(moment(seedData.DueDate).format("MM/DD/YYYY"));
            this.ReminderDate(seedData.ReminderDate ? moment(seedData.ReminderDate).format("MM/DD/YYYY") : "");
            this.Priority(seedData.Priority.Description);
            this.Category(seedData.Category.Description);
            this.Status(seedData.Status.Description);

            this.StatusStyle = ko.computed(() => {                
                return "circle status-" + this.Status().toLowerCase() + "-color"
            });

            this.IsCompleted = ko.computed(() => {
                var isCompleted = this.Status() == "Completed";
                return isCompleted;
            });
        }
    }

}