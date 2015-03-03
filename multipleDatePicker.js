/*
  Creator: Maelig GOHIN For ARCA-Computing - www.arca-computing.fr
  Date: July 2014
  Version: 1.1.5

  Description:  MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates.
          A callback is called everytime a de/selection is done.
          Css style can be changed by editing less or css stylesheet.
          See scope declaration below for options you can pass through html directive.
          Feel free to edit and share this piece of code, our idea is to keep simple ;)
 */
angular.module('multipleDatePicker', [])
  .directive('multipleDatePicker', ['$log', function($log){
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
      dayClick: '=?',
      dayHover: '=?',
      /*
      * Type: function(newMonth, oldMonth)
      * Will be called when month changed
      * Param newMonth/oldMonth will be the first day of month at midnight
      * */
      monthChanged: '=?',
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
      * Set all days off
      * */
      allDaysOff: '=?',
      /*
      * Type: boolean
      * Sunday be the first day of week, default will be Monday
      * */
      sundayFirstDay: '=?',
      /*
       * Type: boolean
       * if true can't go back in months before today's month
       * */
      disallowBackPastMonths: '=',
      /*
       * Type: boolean
       * if true can't go in futur months after today's month
       * */
      disallowGoFuturMonths: '=',
      /*
       * Type: integer
       * it indicates which month [ 0-> jan, 1-> feb, ..., 11 -> dec] will be displayed
       */
      displayMonth: '=?'
    },
    template: '<div class="multiple-date-picker">'+
            '<div class="picker-top-row">'+
              '<div class="text-center picker-navigate picker-navigate-left-arrow" ng-class="{\'disabled\':disableBackButton}" ng-click="previousMonth()">&lt;</div>'+
              '<div class="text-center picker-month">{{month.format(\'MMMM YYYY\')}}</div>'+
              '<div class="text-center picker-navigate picker-navigate-right-arrow" ng-class="{\'disabled\':disableNextButton}" ng-click="nextMonth()">&gt;</div>'+
            '</div>'+
            '<div class="picker-days-week-row">'+
              '<div class="text-center" ng-repeat="day in daysOfWeek">{{day}}</div>'+
            '</div>'+
            '<div class="picker-days-row">'+
              '<div class="text-center picker-day picker-empty" ng-repeat="x in emptyFirstDays">&nbsp;</div>'+
              '<div class="text-center picker-day {{day.style}}" ng-repeat="day in days" ng-click="toggleDay($event, day)" ng-mouseover="hoverDay($event, day)" ng-mouseleave="dayHover($event, day)" ng-class="{\'picker-selected\':day.selected, \'picker-off\':!day.selectable, \'today\':day.today}">{{day ? day.format(\'D\') : \'\'}}</div>'+
              '<div class="text-center picker-day picker-empty" ng-repeat="x in emptyLastDays">&nbsp;</div>'+
            '</div>'+
          '</div>',
    link: function(scope){

      /*utility functions*/
      var checkNavigationButtons = function(){
        var today = moment(),
          previousMonth = moment(scope.month).subtract(1, 'month'),
          nextMonth = moment(scope.month).add(1, 'month');
        scope.disableBackButton = scope.disallowBackPastMonths;
        scope.disableNextButton= scope.disallowGoFuturMonths;
      },
      getDaysOfWeek = function(){
        /*To display days of week names in moment.lang*/
        var momentDaysOfWeek = moment().localeData()._weekdaysMin,
          days = [];

        for(var i = 1; i < 7; i++){
          days.push(momentDaysOfWeek[i]);
        }

        if(scope.sundayFirstDay){
          days.splice(0, 0, momentDaysOfWeek[0]);
        }else{
          days.push(momentDaysOfWeek[0]);
        }

        return days;
      };

      /*scope functions*/
      scope.$watch('daysSelected', function(newValue) {
        if(newValue){
          var momentDates = [];
          newValue.map(function(selectedDate){
            var dateObj;
            if (typeof(selectedDate) === 'object')
            {
              dateObj = moment( selectedDate.date);
              dateObj.style = selectedDate.style || '';
            }
            else
            {
              dateObj = moment(selectedDate);
            }
            momentDates.push(dateObj);
          });
          scope.convertedDaysSelected = momentDates;
          scope.generate();
        }
      }, true);

      scope.$watch('weekDaysOff', function() {
        scope.generate();
      }, true);

      scope.$watch('daysOff', function() {
        scope.generate();
      }, true);

      scope.$watch('allDaysOff', function() {
        scope.generate();
      }, true);

      //default values

      if (scope.displayMonth === undefined)
      {
        scope.month = scope.month || moment().startOf('day');
      }
      else
      {
        var dateMonth = moment().startOf('day').toDate();
        dateMonth.setMonth( scope.displayMonth );
        scope.month = moment(dateMonth);
      }
      scope.days = [];
      scope.convertedDaysSelected = scope.convertedDaysSelected || [];
      scope.weekDaysOff = scope.weekDaysOff || [];
      scope.daysOff = scope.daysOff || [];
      scope.disableBackButton = false;
      scope.disableNextButton = false;
      scope.daysOfWeek = getDaysOfWeek();

      /**
       * Called when user clicks a date
       * @param Event event the click event
       * @param Moment momentDate a moment object extended with selected and isSelectable booleans 
       * @see #momentDate
       * @callback dayClick
       * @callback callback deprecated
       */
      scope.toggleDay = function(event, momentDate){
        event.preventDefault();

        var prevented = false;

        event.preventDefault = function() {
          prevented = true;
        };

        if(typeof scope.dayClick == 'function') {
          scope.dayClick(event, momentDate);
        }

        if(momentDate.selectable && !prevented){
          momentDate.selected = !momentDate.selected;

          if(momentDate.selected) {
            scope.convertedDaysSelected.push(momentDate);
          } else {
            scope.convertedDaysSelected.filter(function(date) {
              return date.valueOf() === momentDate.valueOf();
            });
          }

          if(typeof(scope.callback) === "function"){
            $log.warn('callback option deprecated, please use dayClick');
            scope.callback({timestamp:momentDate.valueOf(), selected:momentDate.selected});
          }
        }
      };

      /**
       * Hover day
       * @param Event event
       * @param Moment day
       */
      scope.hoverDay = function(event, day) {
        event.preventDefault();
        var prevented = false;

        event.preventDefault = function() {
          prevented = true ;
        };

        if(typeof scope.dayHover == 'function') {
          scope.dayHover(event, day);
        }

        if(!prevented) {
          day.hover = event.type === 'mouseover' ? true : false;
        }
      };

      /*Navigate to previous month*/
      scope.previousMonth = function(){
        if(!scope.disableBackButton){
          var oldMonth = moment(scope.month);
          scope.month = scope.month.subtract(1, 'month');
          if(typeof scope.monthChanged == 'function') {
            scope.monthChanged(scope.month, oldMonth);
          }
          scope.generate();
        }
      };

      /*Navigate to next month*/
      scope.nextMonth = function(){
        if(!scope.disableNextButton){
          var oldMonth = moment(scope.month);
          scope.month = scope.month.add(1, 'month');
          if(typeof scope.monthChanged == 'function') {
            scope.monthChanged(scope.month, oldMonth);
          }
          scope.generate();
        }
      };

      /*Check if the date is off : unselectable*/
      scope.isDayOff = function(scope, date){
        return scope.allDaysOff ||
          (angular.isArray(scope.weekDaysOff) && scope.weekDaysOff.some(function(dayOff){
            return date.day() === dayOff;
          })) || 
          (angular.isArray(scope.daysOff) && scope.daysOff.some(function(dayOff){
            return date.isSame(dayOff, 'day');
          }));
      };

      /*Check if the date is selected*/
      scope.isSelected = function(scope, date){
        return scope.convertedDaysSelected.some(function(d){
          return date.isSame(d, 'day');
        });
      };

      scope.getClass = function(scope, date){
        var dateClass = '';
        for (var index in scope.convertedDaysSelected )
        {
          var d = scope.convertedDaysSelected[index];
          if (date.isSame(d, 'day'))
          {
            dateClass = d.style;
          }
        }
        return dateClass;
      };

      /*Generate the calendar*/
      scope.generate = function(){
        var previousDay = moment(scope.month).date(0),
          firstDayOfMonth = moment(scope.month).date(1),
          days = [],
          now = moment(),
          lastDayOfMonth = moment(firstDayOfMonth).endOf('month'),
          maxDays = lastDayOfMonth.date();

        scope.emptyFirstDays = [];

        var emptyFirstDaysStartIndex;
        if(firstDayOfMonth.day() === 0){
          emptyFirstDaysStartIndex = scope.sundayFirstDay ? 0 : 6;
        }else{
          emptyFirstDaysStartIndex = firstDayOfMonth.day() - (scope.sundayFirstDay ? 0 : 1);
        }
        for (var i = emptyFirstDaysStartIndex; i > 0; i--) {
          scope.emptyFirstDays.push({});
        }

        for (var j = 0; j < maxDays; j++) {
          var date = moment(previousDay.add(1, 'days'));
          date.selectable = !scope.isDayOff(scope, date);
          date.selected = scope.isSelected(scope, date);
          if (date.selected)
          {
            date.style = scope.getClass(scope, date);
          }
          date.today = date.isSame(now, 'day');
          days.push(date);
        }

        scope.emptyLastDays = [];
        var emptyLastDaysStartIndex = scope.sundayFirstDay ? 6 : 7;
        if(lastDayOfMonth.day() === 0 && !scope.sundayFirstDay){
          emptyLastDaysStartIndex = 0;
        }else{
          emptyLastDaysStartIndex -= lastDayOfMonth.day();          
        }
        for (var k = emptyLastDaysStartIndex; k > 0; k--) {
          scope.emptyLastDays.push({});
        }
        scope.days = days;
        checkNavigationButtons();
      };

      scope.generate();
    }
  };
}]);
