var app = angular.module('demoApp', ['multipleDatePicker']);

app.controller('demoController', ['$scope', function($scope){
  $scope.logInfos = function(time, selected) {
    alert(moment(time).format('YYYY-M-DD') + ' has been ' + (selected ? '' : 'un') + 'selected');
  }

  $scope.doDate = function(event, date){
    if(event.type == 'click') {
      alert(moment(date).format('YYYY-M-DD') + ' has been ' + (date.selected ? 'un' : '') + 'selected');
    } else {
      console.log(moment(date) + ' has been ' + event.type + 'ed')
    }
  };

  $scope.oneDayOff = [moment().date(14).valueOf()];
  $scope.selectedDays = [moment().date(4).valueOf(), moment().date(5).valueOf(), moment().date(8).valueOf()];
}]);
