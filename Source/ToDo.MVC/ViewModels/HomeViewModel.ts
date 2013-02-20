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

            $.get(url)
                .done((data) => {
                    var temp = self.ToDos();

                    _.each(data, (item) => {
                        var toDoVM = new ToDoItemViewModel(item);

                        temp.push(toDoVM);
                    });

                    self.ToDos.valueHasMutated();
                });

            this.OriginalToDos(this.ToDos());
        }
    }

    
}