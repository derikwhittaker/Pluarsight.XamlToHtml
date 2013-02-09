var ToDo;
(function (ToDo) {
    var HomeViewModel = (function () {
        function HomeViewModel() {
            var _this = this;
            this.ToDos = ko.observableArray();
            this.ToDos.push({
                Id: 1,
                Task: "Fix Issues w/ the Computer",
                DueDate: moment().subtract('days', 2).format("MM/DD/YYYY"),
                ReminderDate: moment().subtract('days', 1).format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Personal",
                Status: "Overdue"
            });
            this.ToDos.push({
                Id: 2,
                Task: "Call Cable company",
                DueDate: moment().format("MM/DD/YYYY"),
                ReminderDate: moment().format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Honey Do",
                Status: "Active"
            });
            this.ToDos.push({
                Id: 3,
                Task: "Order items from Amazon",
                DueDate: moment().add('days', 2).format("MM/DD/YYYY"),
                ReminderDate: moment().add('days', 1).format("MM/DD/YYYY"),
                Priority: "High",
                Category: "Personal",
                Status: "Active"
            });
            this.OverdueCount = ko.computed(function () {
                return _.where(_this.ToDos(), {
                    Status: "Overdue"
                }).length;
            });
            this.ActiveCount = ko.computed(function () {
                return _.where(_this.ToDos(), {
                    Status: "Active"
                }).length;
            });
            this.TotalCount = ko.computed(function () {
                return _this.ToDos().length;
            });
        }
        HomeViewModel.prototype.addNewToDo = function () {
        };
        HomeViewModel.prototype.filterList = function () {
        };
        return HomeViewModel;
    })();
    ToDo.HomeViewModel = HomeViewModel;    
    var ToDoViewModel = (function () {
        function ToDoViewModel(seedDto) {
            this.Id = ko.observable(0);
            this.Task = ko.observable("");
            this.DueDate = ko.observable();
            this.ReminderDate = ko.observable();
            this.Priority = ko.observable("");
            this.Category = ko.observable("");
            this.Status = ko.observable("");
            if(seedDto != undefined) {
                this.Id(seedDto.Id());
                this.Task(seedDto.Task());
                this.DueDate(seedDto.DueDate());
                this.ReminderDate(seedDto.ReminderDate());
                this.Priority(seedDto.Priority());
                this.Category(seedDto.Category());
                this.Status(seedDto.Status());
            }
        }
        return ToDoViewModel;
    })();
    ToDo.ToDoViewModel = ToDoViewModel;    
})(ToDo || (ToDo = {}));
