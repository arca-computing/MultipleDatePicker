/*
  Creator: Maelig GOHIN For ARCA-Computing - www.arca-computing.fr
  Date: July 2014
  Version: 1.0.5

  Description:  MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates.
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
      daysSelected: '=?',
      /*
      * Type: array of integers
      * Recurrent week days not selectables
      * /!\ Sunday = 0, Monday = 1 ... Saturday = 6
      * */
      weekDaysOff: '=?',
      /*
      * Type: array of milliseconds timestamps
      * Days not selectables
      * */
      daysOff: '=?',
      /*
       * Type: boolean
       * if true can't go back in months before today's month
       * */
      disallowBackPastMonths: '=',
      /*
       * Type: boolean
       * if true can't go in futur months after today's month
       * */
      disallowGoFuturMonths: '='
    },
    template: '<div class="multiple-date-picker">'+
            '<div class="picker-top-row">'+
              '<div class="text-center picker-navigate" ng-class="{\'disabled\':disableBackButton}" ng-click="previousMonth()">&lt;</div>'+
              '<div class="text-center picker-month">{{month.format(\'MMMM YYYY\')}}</div>'+
              '<div class="text-center picker-navigate" ng-class="{\'disabled\':disableNextButton}" ng-click="nextMonth()">&gt;</div>'+
            '</div>'+
            '<div class="picker-days-week-row">'+
              '<div class="text-center" ng-repeat="day in daysOfWeek">{{day}}</div>'+
            '</div>'+
            '<div class="picker-days-row">'+
              '<div class="text-center picker-day picker-empty" ng-repeat="x in emptyFirstDays">&nbsp;</div>'+
              '<div class="text-center picker-day" ng-repeat="day in days" ng-click="toggleDay(day)" ng-mouseover="day.hover=true" ng-mouseleave="day.hover=false" ng-class="{\'picker-selected\':day.selected, \'picker-off\':!day.selectable, \'hover\':day.hover && day.selectable, \'today\':day.today}">{{day ? day.format(\'D\') : \'\'}}</div>'+
              '<div class="text-center picker-day picker-empty" ng-repeat="x in emptyLastDays">&nbsp;</div>'+
            '</div>'+
          '</div>',
    link: function(scope){

      /*utility functions*/
      var checkNavigationButtons = function(){
        var today = moment(),
          previousMonth = moment(scope.month).subtract(1, 'month'),
          nextMonth = moment(scope.month).add(1, 'month');
        scope.disableBackButton = scope.disallowBackPastMonths && today.isAfter(previousMonth, 'month');
        scope.disableNextButton= scope.disallowGoFuturMonths && today.isBefore(nextMonth, 'month');
      };

      /*scope functions*/
      scope.$watch('daysSelected', function(newValue) {
        if(newValue){
          var momentDates = [];
          newValue.map(function(timestamp){
            momentDates.push(moment(timestamp));
          })
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

      //default values
      scope.month = scope.month || moment().startOf('day');
      scope.days = [];
      scope.convertedDaysSelected = scope.convertedDaysSelected || [];
      scope.weekDaysOff = scope.weekDaysOff || [];
      scope.daysOff = scope.daysOff || [];
      scope.disableBackButton = false;
      scope.disableNextButton = false;

      /*To display days of week names in moment.lang*/
      var momentDaysOfWeek = moment().localeData()._weekdaysMin;
      scope.daysOfWeek = [momentDaysOfWeek[1], momentDaysOfWeek[2], momentDaysOfWeek[3], momentDaysOfWeek[4], momentDaysOfWeek[5], momentDaysOfWeek[6], momentDaysOfWeek[0]];

      /*
      * @deprecated
      * When user un/select a date, call the callback with 2 params :
      * timestamp : timestamp in ms
      * selected : true if date has been selected, false if date has been unselected
      * */
      scope.toggleDay = function(momentDate){
        if(momentDate.selectable){
          momentDate.selected = !momentDate.selected;
          if(momentDate.selected){
            scope.convertedDaysSelected.push(momentDate);
          } else {
            _.remove(scope.convertedDaysSelected, function(date){
              return date.valueOf() === momentDate.valueOf();
            });
            momentDate.hover = false;
          }
          if(typeof(scope.callback) === "function"){
            scope.callback({timestamp:momentDate.valueOf(), selected:momentDate.selected});
          }
        }
      };

      /*Navigate to previous month*/
      scope.previousMonth = function(){
        if(!scope.disableBackButton){
          scope.month = scope.month.subtract(1, 'month');
          scope.generate();
        }
      };

      /*Navigate to next month*/
      scope.nextMonth = function(){
        if(!scope.disableNextButton){
          scope.month = scope.month.add(1, 'month');
          scope.generate();
        }
      };

      /*Check if the date is off : unselectable*/
      scope.isDayOff = function(scope, date){
        return angular.isArray(scope.weekDaysOff) && scope.weekDaysOff.some(function(dayOff){
          return date.day() === dayOff;
        }) || angular.isArray(scope.daysOff) && scope.daysOff.some(function(dayOff){
          return date.isSame(dayOff, 'day');
        });
      };

      /*Check if the date is selected*/
      scope.isSelected = function(scope, date){
        return scope.convertedDaysSelected.some(function(d){
          return date.isSame(d, 'day');
        });
      };

      /*Generate the calendar*/
      scope.generate = function(){
        var previousDay = moment.utc(scope.month).date(0),
          firstDayOfMonth = moment(scope.month).date(1),
          days = [],
          now = moment(),
          lastDayOfMonth = moment(firstDayOfMonth).endOf('month'),
          maxDays = lastDayOfMonth.date();

        scope.emptyFirstDays = [];
        for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--) {
          scope.emptyFirstDays.push({});
        }

        for (var j = 0; j < maxDays; j++) {
          var date = moment(previousDay.add(1, 'days'));
          date.selectable = !scope.isDayOff(scope, date);
          date.selected = scope.isSelected(scope, date);
          date.today = date.isSame(now, 'day');
          days.push(date);
        }

        scope.emptyLastDays = [];
        for (var k = 7 - (lastDayOfMonth.day() === 0 ? 7 : lastDayOfMonth.day()); k > 0; k--) {
          scope.emptyLastDays.push({});
        }
        scope.days = days;
        checkNavigationButtons();
      };

      scope.generate();
    }
  };
}]);
