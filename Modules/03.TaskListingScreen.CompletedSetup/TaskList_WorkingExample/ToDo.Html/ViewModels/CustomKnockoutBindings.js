$(document).ready(function () {
    ko.bindingHandlers.strikeThroughCompleted = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var addClass = value.toLowerCase() == 'completed';
            $(element).toggleClass("strikethrough", addClass);
        }
    };
});
