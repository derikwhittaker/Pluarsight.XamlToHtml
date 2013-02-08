var ToDo;
(function (ToDo) {
    var HelloworldViewModel = (function () {
        function HelloworldViewModel() {
            this.Message = ko.observable("hello world");
        }
        return HelloworldViewModel;
    })();
    ToDo.HelloworldViewModel = HelloworldViewModel;    
})(ToDo || (ToDo = {}));
