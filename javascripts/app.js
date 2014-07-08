var app = angular.module('demoApp', ['multipleDatePicker']);

app.controller('demoController', ['$scope', function($scope){
	$scope.logInfos = function(timestamp, selected){
		alert(moment(timestamp).format('YYYY-M-DD') + ' has been ' + (selected ? '' : 'un') + 'selected');
	};

	$scope.oneDayOff = [moment().date(14).valueOf()];
	$scope.selectedDays = [moment().date(4).valueOf(), moment().date(5).valueOf(), moment().date(8).valueOf()];
}]);