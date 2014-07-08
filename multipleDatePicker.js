/*
    Creator: Maelig GOHIN For ARCA-Computing - www.arca-computing.fr
    Date: July 2014
    Version: 1.0.0

    Description:    MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates.
                    A callback is called everytime a de/selection is done.
                    Css style can be changed by editing less or css stylesheet.
                    See scope declaration below for options you can pass through html directive.
                    Feel free to edit and share this piece of code, our idea is to keep simple ;)
 */
angular.module('multipleDatePicker', [])
    .directive('multipleDatePicker', [function(){
    "use strict";
    return {
        restrict: 'AE',
        scope: {
            /*
            * Type: function(timestamp, boolean)
            * Will be called when un/select a date
            * Param timestamp will be the date at midnight
            * */
            callback: '&',
            /*
            * Type: array of milliseconds timestamps
            * Days already selected
            * */
            daysSelected: '=',
            /*
            * Type: array of integers
            * Recurrent week days not selectables
            * /!\ Sunday = 0, Monday = 1 ... Saturday = 6
            * */
            weekDaysOff: '=',
            /*
            * Type: array of milliseconds timestamps
            * Days not selectables
            * */
            daysOff: '='
        },
        template: '<div class="multiple-date-picker">'+
                        '<div class="picker-top-row">'+
                            '<div class="text-center picker-navigate" ng-click="previousMonth()">&lt;</div>'+
                            '<div class="text-center picker-month">{{month.format(\'MMMM YYYY\')}}</div>'+
                            '<div class="text-center picker-navigate" ng-click="nextMonth()">&gt;</div>'+
                        '</div>'+
                        '<div class="picker-days-week-row">'+
                            '<div class="text-center" ng-repeat="day in daysOfWeek">{{day}}</div>'+
                        '</div>'+
                        '<div class="picker-days-row">'+
                            '<div class="text-center picker-day picker-empty" ng-repeat="x in emptyFirstDays">&nbsp;</div>'+
                            '<div class="text-center picker-day" ng-repeat="day in days" ng-click="toggleDay(day)" ng-class="{\'picker-selected\':day.selected, \'picker-off\':!day.selectable}">{{day ? day.format(\'D\') : \'\'}}</div>'+
                            '<div class="text-center picker-day picker-empty" ng-repeat="x in emptyLastDays">&nbsp;</div>'+
                        '</div>'+
                    '</div>',
        link: function(scope){
            scope.$watch('daysSelected', function(newValue) {
                if(newValue){
                    var momentDates = [];
                    _.each(newValue, function(timestamp){
                        momentDates.push(moment(timestamp));
                    });
                    scope.convertedDaysSelected = momentDates;
                    scope.generate();
                }
            });
            scope.$watch('callback', function() {
                scope.generate();
            });
            scope.$watch('weekDaysOff', function() {
                scope.generate();
            });
            scope.$watch('daysOff', function() {
                scope.generate();
            });

            scope.month = scope.month || moment().startOf('day');
            scope.days = [];
            scope.convertedDaysSelected = scope.convertedDaysSelected || [];

            /*To display days of week names in moment.lang*/
            var momentDaysOfWeek = moment().lang()._weekdaysMin;
            scope.daysOfWeek = [momentDaysOfWeek[1], momentDaysOfWeek[2], momentDaysOfWeek[3], momentDaysOfWeek[4], momentDaysOfWeek[5], momentDaysOfWeek[6], momentDaysOfWeek[0]];



            /*When user un/select a date, call the callback with 2 params :
            *     timestamp : timestamp in ms
            *     selected : true if date has been selected, false if date has been unselected
            * */
            scope.toggleDay = function(momentDate){
                if(momentDate.selectable){
                    momentDate.selected = !momentDate.selected;
                    if(momentDate.selected){
                        scope.convertedDaysSelected.push(momentDate);
                    }else{
                        _.remove(scope.convertedDaysSelected, function(date){
                            return date.valueOf() === momentDate.valueOf();
                        });
                    }
                    if(typeof(scope.callback) === "function"){
                        scope.callback({timestamp:momentDate.valueOf(), selected:momentDate.selected});
                    }
                }
            };

            /*Navigate to previous month*/
            scope.previousMonth = function(){
                scope.month = scope.month.subtract('month', 1);
                scope.generate();
            };

            /*Navigate to next month*/
            scope.nextMonth = function(){
                scope.month = scope.month.add('month', 1);
                scope.generate();
            };

            /*Check if the date is off : unselectable*/
            scope.isDayOff = function(scope, date){
                return _.any(scope.weekDaysOff, function(dayOff){
                    return date.day() === dayOff;
                }) || _.any(scope.daysOff, function(dayOff){
                    return date.isSame(dayOff, 'day');
                });
            };

            /*Check if the date is selected*/
            scope.isSelected = function(scope, date){
                return _.any(scope.convertedDaysSelected, function(d){
                    return date.isSame(d, 'day');
                });
            };

            /*Generate the calendar*/
            scope.generate = function(){
                var previousDay = moment(scope.month).date(0),
                    firstDayOfMonth = moment(scope.month).date(1),
                    days = [],
                    lastDayOfMonth = moment(firstDayOfMonth).endOf('month'),
                    maxDays = lastDayOfMonth.date();

                scope.emptyFirstDays = _.range(firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1);

                for (var i = 0; i < maxDays; i++) {
                    var date = moment(previousDay.add('days', 1));
                    date.selectable = !scope.isDayOff(scope, date);
                    date.selected = scope.isSelected(scope, date);
                    days.push(date);
                }

                scope.emptyLastDays = _.range(7 - (lastDayOfMonth === 0 ? 7 : lastDayOfMonth.day()));

                scope.days = days;
            };

            scope.generate();
        }
    };
}]);