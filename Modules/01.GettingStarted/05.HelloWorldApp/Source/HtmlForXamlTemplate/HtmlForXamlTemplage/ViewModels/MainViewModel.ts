/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />

module ToDo {
    export class MainViewModel {
        public Message: KnockoutObservableString = ko.observable("Hello World");
    }
}