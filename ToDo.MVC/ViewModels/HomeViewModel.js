var ToDo;
(function (ToDo) {
    var HomeViewModel = (function () {
        function HomeViewModel() {
            var _this = this;
            this.ToDos = ko.observableArray();
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
        };
        HomeViewModel.prototype.filterList = function () {
        };
        HomeViewModel.prototype.fetchRemoteToDoList = function () {
            this.ToDos.push(new ToDoViewModel({
                Id: 1,
                Task: "Fix Issues w/ the Computer",
                DueDate: moment().subtract('days', 2).format("MM/DD/YYYY"),
                ReminderDate: moment().subtract('days', 1).format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Personal",
                Status: "Overdue"
            }));
            this.ToDos.push(new ToDoViewModel({
                Id: 2,
                Task: "Call Cable company",
                DueDate: moment().format("MM/DD/YYYY"),
                ReminderDate: moment().format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Honey Do",
                Status: "Active"
            }));
            this.ToDos.push(new ToDoViewModel({
                Id: 3,
                Task: "Order items from Amazon",
                DueDate: moment().add('days', 2).format("MM/DD/YYYY"),
                ReminderDate: moment().add('days', 1).format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Personal",
                Status: "Active"
            }));
            this.ToDos.push(new ToDoViewModel({
                Id: 4,
                Task: "Order items from Amazon",
                DueDate: moment().add('days', 4).format("MM/DD/YYYY"),
                ReminderDate: moment().add('days', 3).format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Personal",
                Status: "Completed"
            }));
        };
        return HomeViewModel;
    })();
    ToDo.HomeViewModel = HomeViewModel;    
    var ToDoViewModel = (function () {
        function ToDoViewModel(seedDto) {
            var _this = this;
            this.Id = ko.observable(0);
            this.Task = ko.observable("");
            this.DueDate = ko.observable();
            this.ReminderDate = ko.observable();
            this.Priority = ko.observable("");
            this.Category = ko.observable("");
            this.Status = ko.observable("");
            if(seedDto != undefined) {
                this.Id(seedDto.Id);
                this.Task(seedDto.Task);
                this.DueDate(seedDto.DueDate);
                this.ReminderDate(seedDto.ReminderDate);
                this.Priority(seedDto.Priority);
                this.Category(seedDto.Category);
                this.Status(seedDto.Status);
            }
            this.StatusStyle = ko.computed(function () {
                switch(_this.Status()) {
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
            this.IsCompleted = ko.computed(function () {
                var isCompleted = _this.Status() == "Completed";
                return isCompleted;
            });
        }
        return ToDoViewModel;
    })();
    ToDo.ToDoViewModel = ToDoViewModel;    
})(ToDo || (ToDo = {}));
