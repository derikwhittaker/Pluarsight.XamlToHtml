/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />


interface KnockoutBindingHandlers {
    strikeThroughCompleted: KnockoutBindingHandler;
}

$(document).ready(() => {

    ko.bindingHandlers.strikeThroughCompleted = {
        init: (element, valueAccessor) => {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var addClass = value.toLowerCase() == 'completed'
            $(element).toggleClass("strikethrough", addClass);
        }
    };

});




