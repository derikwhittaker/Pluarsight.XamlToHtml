var ToDo;
(function (ToDo) {
    var HomeViewModel = (function () {
        function HomeViewModel() {
            var _this = this;
            this.ToDos = ko.observableArray();
            this.OriginalToDos = ko.observableArray();
            this.FilterText = ko.observable("");
            this.fetchRemoteToDoList();
            this.OverdueCount = ko.computed(function () {
                var count = _.filter(_this.ToDos(), function (item) {
                    return item.Status() == "Overdue";
                }).length;
                return count;
            });
            this.ActiveCount = ko.computed(function () {
                var count = _.filter(_this.ToDos(), function (item) {
                    return item.Status() == "Active";
                }).length;
                return count;
            });
            this.TotalCount = ko.computed(function () {
                return _this.ToDos().length;
            });
        }
        HomeViewModel.prototype.addNewToDo = function () {
            var self = this;
            var model = new ToDo.MaintainItemViewModel(undefined);
            var divName = '#todo-edit-modal';
            $(divName).modal('show');
            $(divName).on('shown', function () {
                model.fetchData();
                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });
            $(divName).on('hide', function () {
                self.fetchRemoteToDoList();
                ko.cleanNode($(divName)[0]);
                $(divName).off('shown hide');
            });
        };
        HomeViewModel.prototype.deleteToDo = function (id) {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/Delete/" + id;
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (data) {
                    self.fetchRemoteToDoList();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        };
        HomeViewModel.prototype.editToDo = function (id) {
            var self = this;
            var model = new ToDo.MaintainItemViewModel(id);
            var divName = '#todo-edit-modal';
            $(divName).modal('show');
            $(divName).on('shown', function () {
                model.fetchData();
                var modalDialog = $(divName)[0];
                ko.applyBindings(model, modalDialog);
            });
            $(divName).on('hide', function () {
                self.fetchRemoteToDoList();
                ko.cleanNode($(divName)[0]);
                $(divName).off('shown hide');
            });
        };
        HomeViewModel.prototype.filterList = function () {
            var self = this;
            if(self.FilterText().length == 0) {
                self.ToDos(self.OriginalToDos());
            } else {
                var results = _.filter(self.OriginalToDos(), function (item) {
                    return item.Task().toLowerCase().indexOf(self.FilterText().toLowerCase()) >= 0;
                });
                self.ToDos(results);
            }
        };
        HomeViewModel.prototype.fetchRemoteToDoList = function () {
            var self = this;
            var url = "http://localhost:8888/ToDoServices/api/ToDo/";
            self.OriginalToDos.removeAll();
            self.ToDos.removeAll();
            $.get(url).done(function (data) {
                var temp = self.ToDos();
                _.each(data, function (item) {
                    var toDoVM = new ToDo.ToDoItemViewModel(item);
                    temp.push(toDoVM);
                });
                self.ToDos.valueHasMutated();
            });
            this.OriginalToDos(this.ToDos());
        };
        return HomeViewModel;
    })();
    ToDo.HomeViewModel = HomeViewModel;    
})(ToDo || (ToDo = {}));
