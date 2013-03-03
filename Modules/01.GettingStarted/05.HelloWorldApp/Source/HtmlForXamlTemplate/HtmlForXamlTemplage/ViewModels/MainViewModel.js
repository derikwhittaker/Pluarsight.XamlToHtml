var ToDo;
(function (ToDo) {
    var MainViewModel = (function () {
        function MainViewModel() {
            this.Message = ko.observable("Hello World");
        }
        return MainViewModel;
    })();
    ToDo.MainViewModel = MainViewModel;    
})(ToDo || (ToDo = {}));
