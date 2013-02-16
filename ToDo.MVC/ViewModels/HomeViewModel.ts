/// <reference path="../Scripts/d.ts/references.ts" />
/// <reference path="ToDoItemViewModel.ts" />
/// <reference path="MaintainItemViewModel.ts" />

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
            var self = this;
            var model = new MaintainItemViewModel(undefined);
                      
            var divName = '#todo-edit-modal'
            $(divName).modal('show');

            $(divName).on('shown', () => {
                model.fetchData();

                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });

            $(divName).on('hide', () => {

                self.fetchRemoteToDoList();
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
                    self.fetchRemoteToDoList();
                },
                error: (XMLHttpRequest, textStatus, errorThrown) => {

                }
            });
        }

        editToDo(id: number) {
            var self = this;

            var model = new MaintainItemViewModel(id);

            var divName = '#todo-edit-modal'
            $(divName).modal('show');

            $(divName).on('shown', () => {
                model.fetchData();

                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });

            $(divName).on('hide', () => {

                self.fetchRemoteToDoList();
                ko.cleanNode($(divName)[0]);
                $(divName).off('shown hide')
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
            self.OriginalToDos.removeAll();
            self.ToDos.removeAll();

            $.ajax({
                url: url,
                type: 'Get',
                success: (data) => {                   
                    var temp = self.ToDos();

                    _.each(data, (item) => {
                        var toDoVM = new ToDoItemViewModel(item);

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

    
}