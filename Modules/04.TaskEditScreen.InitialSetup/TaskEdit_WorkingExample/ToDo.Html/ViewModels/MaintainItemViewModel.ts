/// <reference path="../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../Scripts/typings/moment/moment.d.ts" />
/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />

module ToDo.ViewModels {
    export class MaintainItemViewModel {

        public Id: KnockoutObservableNumber = ko.observable(0);
        public Task: KnockoutObservableString = ko.observable("");
        public DueDate: KnockoutObservableString = ko.observable();
        public ReminderDate: KnockoutObservableString = ko.observable();

        public Priorities: KnockoutObservableArray = ko.observableArray();
        public SelectedPriority: KnockoutObservableAny = ko.observable();
        public Categories: KnockoutObservableArray = ko.observableArray();
        public SelectedCategory: KnockoutObservableAny = ko.observable();
        public Statuses: KnockoutObservableArray = ko.observableArray();
        public SelectedStatus: KnockoutObservableAny = ko.observable();

        constructor() {

        }
    }
}