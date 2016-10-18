var app = angular.module('demoApp', ['multipleDatePicker']);

app.controller('demoController', ['$scope', function ($scope) {
    $scope.today = moment();

    $scope.myMonth = moment().add(3, 'MONTH');

    $scope.highlightDays = [
        {date: moment().date(2), css: 'holiday', selectable: false, title: 'Holiday time !'},
        {date: moment().date(14), css: 'off', selectable: false, title: 'We don\'t work today'},
        {
            date: moment().date(25),
            css: 'birthday',
            selectable: true,
            title: 'I\'m thir... i\'m 28, seriously, I mean ...'
        }
    ];

    $scope.selectedDays2 = [moment().date(4), moment().date(5), moment().date(8)];
    $scope.selectedDays3 = [];

    $scope.daysAllowed = [moment().date(4), moment().date(5), moment().date(8)];

    $scope.myArrayOfDates = [moment().date(4), moment().date(5), moment().date(8)];

    $scope.$watch('myArrayOfDates', function (newValue) {
        if (newValue) {
            console.log('my array changed, new size : ' + newValue.length);
        }
    }, true);

    $scope.logMonthChanged = function (newMonth, oldMonth) {
        alert('new month : ' + newMonth.format('YYYY-MM-DD') + ' || old month : ' + oldMonth.format('YYYY-MM-DD'));
    };

    $scope.oneDaySelectionOnly = function () {
        $scope.selectedDays3.length = 0;
    };

    $scope.changeMomentLocale = function (locale) {
        moment.locale(locale);
    };

    $scope.rightClickCb = function(event, day){
        alert('right clicked on ' + day.date.format('YYYY-MM-DD'));
    };

    $scope.disable6MonthsFromNow = function(event, month){
        if(month.isBefore(moment().subtract(6, 'month'), 'month') || month.isAfter(moment().add(6, 'month'), 'month')){
            event.preventDefault();
        }
    };

}]);
