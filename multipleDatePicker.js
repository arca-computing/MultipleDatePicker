/*
 Creator: Maelig GOHIN For ARCA-Computing - www.arca-computing.fr
 Creation date: July 2014
 Version: 1.2

 Description:  MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates.
 Css style can be changed by editing less or css stylesheet.
 See scope declaration below for options you can pass through html directive.
 Feel free to edit and share this piece of code, our idea is to keep it simple ;)
 */
angular.module('multipleDatePicker', [])
    .directive('multipleDatePicker', ['$log', function ($log) {
        "use strict";
        return {
            restrict: 'AE',
            scope: {
                /*
                 * DEPRECATED : use dayClick
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
                 * Type: function(newYear, oldYear)
                 * Will be called when Year changed
                 * Param newYear/oldYear will be the month day of year
                 * */
                yearChanged: '=?',
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
                 * DEPRECATED : use highlightDays
                 * Type: array of milliseconds timestamps
                 * Days not selectables
                 * */
                daysOff: '=?',
                /*
                 * Type: array of objects cf doc
                 * Days highlights
                 * */
                highlightDays: '=?',
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
                 * Type: string
                 * Either "Year" or "Month"
                 * */
                calendarMode: '=?'
            },
            template: '<div class="multiple-date-picker">' +
            '<div class="picker-top-row">' +
              '<div class="text-center picker-navigate picker-navigate-left-arrow" ng-class="{\'disabled\':disableBackButton}" ng-click="previous()">&lt;</div>' +
              //'<div class="text-center picker-month">{{month.format(\'MMMM YYYY\')}}</div>' +
              '<div class="text-center picker-month" ng-if="calendarMode==\'Month\'">{{month.format(topRowDateFormat)}}</div>'+
              '<div class="text-center picker-month" ng-if="calendarMode==\'Year\'">{{year.format(topRowDateFormat)}}</div>'+
              '<div class="text-center picker-navigate picker-navigate-right-arrow" ng-class="{\'disabled\':disableNextButton}" ng-click="next()">&gt;</div>' +
            '</div>' +
            '<div class="picker-days-week-row" ng-if="calendarMode==\'Month\'">' +
              '<div class="text-center" ng-repeat="day in daysOfWeek">{{day}}</div>' +
            '</div>' +
            '<div class="picker-days-row" ng-if="calendarMode==\'Month\'">' +
              '<div class="text-center picker-date picker-empty" ng-repeat="x in emptyFirstDays">&nbsp;</div>' +
              '<div class="text-center picker-date {{day.css}}" title="{{day.title}}" ng-repeat="day in days" ng-click="toggleDay($event, day)" ng-mouseover="hoverDay($event, day)" ng-mouseleave="dayHover($event, day)" ng-class="{\'picker-selected\':day.selected, \'picker-off\':!day.selectable, \'today\':day.today}">{{day ? day.format(\'D\') : \'\'}}</div>' +
              '<div class="text-center picker-date picker-empty" ng-repeat="x in emptyLastDays">&nbsp;</div>' +
            '</div>' +
            '<div class="picker-months-row" ng-if="calendarMode==\'Year\'">'+
              '<div class="text-center picker-date picker-month {{date.styles.join(\' \')}}" ng-repeat="date in months" ng-click="toggleDay($event, date)" ng-mouseover="hoverDay($event, date)" ng-mouseleave="dayHover($event, date)" ng-class="{\'picker-selected\':date.selected, \'picker-off\':!date.selectable, \'today\':date.today}">{{date ? date.format(\'MMM\') : \'\'}}</div>'+
            '</div>' +
            '</div>',
            link: function (scope, element, attr) {

                /*utility functions*/
                var checkNavigationButtons = function () {
                        var today = moment(),
                            previousMonth = moment(scope.month).subtract(1, 'month'),
                            nextMonth = moment(scope.month).add(1, 'month');
                        scope.disableBackButton = scope.disallowBackPastMonths && today.isAfter(previousMonth, 'month');
                        scope.disableNextButton = scope.disallowGoFuturMonths && today.isBefore(nextMonth, 'month');
                    },
                    getDaysOfWeek = function () {
                        /*To display days of week names in moment.lang*/
                        var momentDaysOfWeek = moment().localeData()._weekdaysMin,
                            days = [];

                        for (var i = 1; i < 7; i++) {
                            days.push(momentDaysOfWeek[i]);
                        }

                        if (scope.sundayFirstDay) {
                            days.splice(0, 0, momentDaysOfWeek[0]);
                        } else {
                            days.push(momentDaysOfWeek[0]);
                        }

                        return days;
                    };

                /*scope functions*/
                scope.$watch('daysSelected', function (newValue) {
                    if (newValue) {
                        var momentDates = [];
                        newValue.map(function (timestamp) {
                            momentDates.push(moment(timestamp));
                        });
                        scope.convertedDaysSelected = momentDates;
                        scope.generate();
                    }
                }, true);

                scope.$watch('weekDaysOff', function () {
                    scope.generate();
                }, true);

                scope.$watch('daysOff', function (value) {
                    if (value !== undefined) {
                        $log.warn('daysOff option deprecated since version 1.1.6, please use highlightDays');
                    }
                    scope.generate();
                }, true);

                scope.$watch('highlightDays', function () {
                    scope.generate();
                }, true);

                scope.$watch('allDaysOff', function () {
                    scope.generate();
                }, true);

                //default values
                scope.month = scope.month || moment().startOf('day');
                scope.year = scope.year || moment().startOf('year');
                scope.days = [];
                scope.convertedDaysSelected = scope.convertedDaysSelected || [];
                scope.weekDaysOff = scope.weekDaysOff || [];
                scope.daysOff = scope.daysOff || [];
                scope.disableBackButton = false;
                scope.disableNextButton = false;
                scope.daysOfWeek = getDaysOfWeek();
                scope.calendarMode = (attr.calendarMode)?attr.calendarMode : 'Month';
                scope.topRowDateFormat = (scope.calendarMode=='Month')? 'MMMM YYYY' : 'YYYY';

                /**
                 * Called when user clicks a date
                 * @param Event event the click event
                 * @param Moment momentDate a moment object extended with selected and isSelectable booleans
                 * @see #momentDate
                 * @callback dayClick
                 * @callback callback deprecated
                 */
                scope.toggleDay = function (event, momentDate) {
                    event.preventDefault();

                    var prevented = false;

                    event.preventDefault = function () {
                        prevented = true;
                    };

                    if (typeof scope.dayClick == 'function') {
                        scope.dayClick(event, momentDate);
                    }

                    if (momentDate.selectable && !prevented) {
                        momentDate.selected = !momentDate.selected;

                        if (momentDate.selected) {
                            scope.convertedDaysSelected.push(momentDate);
                        } else {
                            scope.convertedDaysSelected = scope.convertedDaysSelected.filter(function (date) {
                                return date.valueOf() !== momentDate.valueOf();
                            });
                        }

                        if (typeof(scope.callback) === "function") {
                            $log.warn('callback option deprecated, please use dayClick');
                            scope.callback({timestamp: momentDate.valueOf(), selected: momentDate.selected});
                        }
                    }
                };

                /**
                 * Hover day
                 * @param Event event
                 * @param Moment day
                 */
                scope.hoverDay = function (event, day) {
                    event.preventDefault();
                    var prevented = false;

                    event.preventDefault = function () {
                        prevented = true;
                    };

                    if (typeof scope.dayHover == 'function') {
                        scope.dayHover(event, day);
                    }

                    if (!prevented) {
                        day.hover = event.type === 'mouseover' ? true : false;
                    }
                };

                /*Navigate to previous month*/
                scope.previous = function () {
                    if (!scope.disableBackButton) {
                      if(scope.calendarMode=="Month"){
                          var oldMonth = moment(scope.month);
                          scope.month = scope.month.subtract(1, 'month');
                          if (typeof scope.monthChanged == 'function') {
                              scope.monthChanged(scope.month, oldMonth);
                          }
                      }
                      if(scope.calendarMode=="Year"){
                          var oldYear = moment(scope.year);
                          scope.year = scope.year.subtract(1,'year');
                          if (typeof scope.yearChanged == 'function') {
                              scope.yearChanged(scope.year, oldYear);
                          }
                      }
                      scope.generate();
                    }
                };

                /*Navigate to next month*/
                scope.next = function () {
                    if (!scope.disableNextButton) {
                      if(scope.calendarMode=="Month"){
                          var oldMonth = moment(scope.month);
                          scope.month = scope.month.add(1, 'month');
                          if (typeof scope.monthChanged == 'function') {
                              scope.monthChanged(scope.month, oldMonth);
                          }
                          scope.generate();
                      }
                      if(scope.calendarMode=="Year"){
                          var oldYear = moment(scope.year);
                          scope.year = scope.year.add(1,'year');
                          if (typeof scope.yearChanged == 'function') {
                              scope.yearChanged(scope.year, oldYear);
                          }
                      }
                      scope.generate();
                    }
                };

                /*Check if the date is off : unselectable*/
                scope.isDayOff = function (scope, date) {
                    return scope.allDaysOff ||
                        (angular.isArray(scope.weekDaysOff) && scope.weekDaysOff.some(function (dayOff) {
                            return date.day() === dayOff;
                        })) ||
                        (angular.isArray(scope.daysOff) && scope.daysOff.some(function (dayOff) {
                            return date.isSame(dayOff, 'day');
                        })) ||
                        (angular.isArray(scope.highlightDays) && scope.highlightDays.some(function (highlightDay) {
                            return date.isSame(highlightDay.date, 'day') && !highlightDay.selectable;
                        }));
                };

                /*Check if the date is selected*/
                scope.isSelected = function (scope, date) {
                    return scope.convertedDaysSelected.some(function (d) {
                        return date.isSame(d, 'day');
                    });
                };

                /*Generate the calendar*/
                scope.generate = function () {
                    var previousDay = moment(scope.month).date(0),
                        firstDayOfMonth = moment(scope.month).date(1),
                        days = [],
                        now = moment(),
                        lastDayOfMonth = moment(firstDayOfMonth).endOf('month'),
                        maxDays = lastDayOfMonth.date();

                    var createDate = function(){
                        var date = moment(previousDay.add(1, 'days'));
                        if(angular.isArray(scope.highlightDays)){
                            var hlDay = scope.highlightDays.filter(function(d){
                                return date.isSame(d.date, 'day');
                            });
                            date.css = hlDay.length > 0 ? hlDay[0].css : '';
                            date.title = hlDay.length > 0 ? hlDay[0].title : '';
                        }
                        date.selectable = !scope.isDayOff(scope, date);
                        date.selected = scope.isSelected(scope, date);
                        date.today = date.isSame(now, 'day');
                        return date;
                    };


                    if(scope.calendarMode=='Month'){
                      scope.emptyFirstDays = [];

                      var emptyFirstDaysStartIndex;
                      if (firstDayOfMonth.day() === 0) {
                          emptyFirstDaysStartIndex = scope.sundayFirstDay ? 0 : 6;
                      } else {
                          emptyFirstDaysStartIndex = firstDayOfMonth.day() - (scope.sundayFirstDay ? 0 : 1);
                      }
                      for (var i = emptyFirstDaysStartIndex; i > 0; i--) {
                          scope.emptyFirstDays.push({});
                      }

                      for (var j = 0; j < maxDays; j++) {
                          days.push(createDate());
                      }

                      scope.emptyLastDays = [];
                      var emptyLastDaysStartIndex = scope.sundayFirstDay ? 6 : 7;
                      if (lastDayOfMonth.day() === 0 && !scope.sundayFirstDay) {
                          emptyLastDaysStartIndex = 0;
                      } else {
                          emptyLastDaysStartIndex -= lastDayOfMonth.day();
                      }
                      for (var k = emptyLastDaysStartIndex; k > 0; k--) {
                          scope.emptyLastDays.push({});
                      }
                      scope.days = days;
                  }
                  else if(scope.calendarMode=='Year'){
                    var months = [];
                    var monthsOfYear = moment().locale( scope.displayLocale || '').localeData()._monthsShort;
                    for (var l = 0; l < monthsOfYear.length; ++l){
                      var date = moment('1 ' + monthsOfYear[l]+' '+scope.year.year());
                          if(angular.isArray(scope.highlightDays)){
                              var hlDay = scope.highlightDays.filter(function(d){
                                  return date.isSame(d.date, 'month');
                              });
                              date.css = hlDay.length > 0 ? hlDay[0].css : '';
                              date.title = hlDay.length > 0 ? hlDay[0].title : '';
                          }
                          date.selectable = !scope.isDayOff(scope, date);
                          date.selected = scope.isSelected(scope, date);
                          date.today = date.isSame(now, 'day');
                      months.push(date);
                    }
                    scope.months = months;
                    checkNavigationButtons();
                  }
                    checkNavigationButtons();
                };

                scope.generate();
            }
        };
    }]);