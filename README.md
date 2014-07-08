#What is MultipleDatePicker ?
MultipleDatePicker is an Angular directive to show a simple calendar allowing user to select multiple dates, a callback is called, you can specify some off days or already selected days.

#First install it
**Using Bower**
        
        bower install "multiple-date-picker"
                
**Git Clone**
        
        https://github.com/arca-computing/MultipleDatePicker.git      
        
#How to use
###Add it to your app
```javascript
var app = angular.module('myApp', ['multipleDatePicker']);
```

###Put it in your html
```html
[...]
<div>
    <multiple-date-picker/>
</div>
[...]
```
It will use the max width of it's parent, so If you want to reduce it specify a width (or use Bootstrap/Foundation)
```html
<div style="width:25%">
    <multiple-date-picker/>
<div/>
```

###Add some options
You can give some options :

* callback : will be called everytime a date is un/selected

* days-selected : array of days (timestamp in ms) already selected (and can be deselected)

* week-days-off : array of days off (from 0 (Sunday) to 6 (Saturday)) of the week. Those days will not be selectable

* days-off : array of days (timestamp in ms) off. Thos days will not be selectable

####callback
**Be aware that the timestamp given to the callback is a date at midnight**
ex : call a funtion to log infos in the js console
```javascript
<multiple-date-picker callback="logInfos(timestamp, selected);"/>
```
*logInfos is a function in the controller scope*

####days-off
ex : 2 dates not selectable
```javascript
<multiple-date-picker days-off="[1404770400000, 1405029600000]"/>
```

####week-days-off
ex : Here Sunday (0) and Wednesday (3) are never selectable
```javascript
<multiple-date-picker week-days-off="[0, 3]"/>
```

####days-selected
ex : 2 dates selected when building the calendar
```javascript
<multiple-date-picker days-selected="[1404770400000, 1405029600000]"/>
```

#What's next ?
We created this directive to have a simple calendar with multi-dates selection. We will keep it simple but any improvement is welcome.