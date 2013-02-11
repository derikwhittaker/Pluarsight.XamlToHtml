/// <reference path="../Scripts/d.ts/references.ts" />

module ToDo {
    export class HomeViewModel {
        
        public ToDos: KnockoutObservableArray = ko.observableArray();
        public OriginalToDos: KnockoutObservableArray = ko.observableArray();
        public OverdueCount: KnockoutComputed;
        public ActiveCount: KnockoutComputed;
        public TotalCount: KnockoutComputed;
        public FilterText: KnockoutObservableString = ko.observable("");

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
            var model = new ToDoViewModel(undefined);
            model.Task("Hello");
           
            var divName = '#todo-edit-modal'
            $(divName).modal('show');

            $(divName).on('shown', () => {
                model.fetchData();
                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });

            $(divName).on('hide', () => {
                //model.parent.fetchContacts();

                ko.cleanNode($(divName)[0]);
                $(divName).off('shown hide')
            });
        }

        deleteToDo(id: number) {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/Delete/" + id;
            
            $.ajax({
                url: url,
                type: 'DELETE',
                success: (data) => {
                    self.OriginalToDos.removeAll();
                    self.ToDos.removeAll();
                    self.fetchRemoteToDoList();
                },
                error: (XMLHttpRequest, textStatus, errorThrown) => {

                }
            });
        }

        filterList() {
            var self = this;

            if (self.FilterText().length == 0) {
                self.ToDos(self.OriginalToDos());
            }
            else {
                var results = _.filter(self.OriginalToDos(), function (item) {
                    return item.Task().toLowerCase().indexOf(self.FilterText().toLowerCase()) >= 0;
                });

                self.ToDos(results);
            }
        }

        fetchRemoteToDoList() {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/";

            $.ajax({
                url: url,
                type: 'Get',
                success: (data) => {                   
                    var temp = self.ToDos();

                    _.each(data, (item) => {
                        var toDoVM = new ToDoViewModel(item);
                        toDoVM.Parent = this;
                        temp.push(toDoVM);
                    });

                    self.ToDos.valueHasMutated();
                },
                error: (XMLHttpRequest, textStatus, errorThrown) => { }
            });

            //this.ToDos.push(new ToDoViewModel( {
            //    Id: 1, Task: "Fix Issues w/ the Computer",
            //    DueDate: moment().subtract('days', 2).format("MM/DD/YYYY"), ReminderDate: moment().subtract('days', 1).format("MM/DD/YYYY"),
            //    Priority: "High", Category: "Personal", Status: "Overdue"
            //}));

            //this.ToDos.push(new ToDoViewModel({
            //    Id: 2, Task: "Call Cable company",
            //    DueDate: moment().format("MM/DD/YYYY"), ReminderDate: moment().format("MM/DD/YYYY"),
            //    Priority: "High", Category: "Honey Do", Status: "Active"
            //}));

            //this.ToDos.push(new ToDoViewModel({
            //    Id: 3, Task: "Order items from Amazon",
            //    DueDate: moment().add('days', 2).format("MM/DD/YYYY"), ReminderDate: moment().add('days', 1).format("MM/DD/YYYY"),
            //    Priority: "High", Category: "Personal", Status: "Active"
            //}));

            //this.ToDos.push(new ToDoViewModel({
            //    Id: 4, Task: "Order items from Amazon",
            //    DueDate: moment().add('days', 4).format("MM/DD/YYYY"), ReminderDate: moment().add('days', 3).format("MM/DD/YYYY"),
            //    Priority: "High", Category: "Personal", Status: "Completed"
            //}));

            this.OriginalToDos(this.ToDos());
        }
    }
    
    export class ToDoViewModel {
        public Parent: HomeViewModel = undefined;
        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableString = ko.observable();
        public ReminderDate: KnockoutObservableString = ko.observable();
        public Priority: KnockoutObservableString = ko.observable("");
        public Category: KnockoutObservableString = ko.observable("");
        public Status: KnockoutObservableString = ko.observable("");
        public StatusStyle: KnockoutComputed;
        public IsCompleted: KnockoutComputed;
        public Priorities: KnockoutObservableArray = ko.observableArray();
        public SelectedPriority: KnockoutObservableAny = ko.observable();
        public Categories: KnockoutObservableArray = ko.observableArray();
        public SelectedCategory: KnockoutObservableAny = ko.observable();
        public Statuses: KnockoutObservableArray = ko.observableArray();
        public SelectedStatus: KnockoutObservableAny = ko.observable();

        constructor(seedDto: any) {
            if (seedDto != undefined) {

                var reminderDate = seedDto.ReminderDate ? moment(seedDto.ReminderDate).format("MM/DD/YYYY") : "";

                this.Id(seedDto.Id);
                this.Task(seedDto.Task);
                this.DueDate(moment(seedDto.DueDate).format("MM/DD/YYYY"));
                this.ReminderDate(reminderDate);

                // for mock data fetch                
                //this.Priority(seedDto.Priority);
                //this.Category(seedDto.Category);
                //this.Status(seedDto.Status);

                // for real data fetch
                this.Priority(seedDto.Priority.Description);
                this.Category(seedDto.Category.Description);
                this.Status(seedDto.Status.Description);
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

        private remoteCallCounter = 0;
        private totalRemoteCallsExpected = 3;

        public fetchData() {
            this.remoteCallCounter = 0;
            this.fetchCategories();
            this.fetchPriorities();
            this.fetchStatuses();
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
    }

}